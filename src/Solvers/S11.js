import React from 'react';
import Solver from './Solver';
import { CssImage } from '../util';

class Computer {
	fill(num, positions) {
		if (num === undefined) return "";
		if (num < 0) return "-" + this.fill(-num, positions - 1);
		let res = num.toString();
		while (res.length < positions) res = "0" + res;
		return res;
	}

	dass(ip, positions) {
		let i = ip;
		let m = [];
		while (positions-- > 0) { m.push(this.fill(this.mem[i++], 5)); }
		return `${this.fill(ip, 4)}: {${m.join(", ")}}`;
	}

	nop = {
		p: [],
		debug: (ip) => { return `${this.dass(ip, 4)} NOP`; },
		op: (ip) => { return ip + 1; }
	}

	add = {
		p: [true, true, false],
		debug: (ip, a, b, c) => { return `${this.dass(ip, 4)} mem[${c}] = ${a}+${b} (${a + b})`; },
		op: (ip, a, b, c) => { this.mem[c] = a + b; return ip + 4; }
	}

	mul = {
		p: [true, true, false],
		debug: (ip, a, b, c) => { return `${this.dass(ip, 4)} mem[${c}] = ${a}*${b} (${a * b})`; },
		op: (ip, a, b, c) => { this.mem[c] = a * b; return ip + 4; }
	}

	input = {
		p: [false],
		debug: (ip, a) => { return `${this.dass(ip, 2)} input mem[${a}] (${this.stdin[0]})`; },
		op: (ip, a) => { this.mem[a] = this.stdin.shift(); return ip + 2; }
	}

	output = {
		p: [true],
		debug: (ip, a) => { return `${this.dass(ip, 2)} output ${a}`; },
		op: (ip, a) => { this.stdout.push(a); return ip + 2; }
	}

	jmt = {
		p: [true, true],
		debug: (ip, a, b) => { return `${this.dass(ip, 3)} jmt ${a}, ${b}`; },
		op: (ip, a, b) => { return a ? b : ip + 3; }
	}

	jmf = {
		p: [true, true],
		debug: (ip, a, b) => { return `${this.dass(ip, 3)} jmf ${a}, ${b}`; },
		op: (ip, a, b) => { return a ? ip + 3 : b; }
	}

	less = {
		p: [true, true, false],
		debug: (ip, a, b, c) => { return `${this.dass(ip, 4)} less ${a}, ${b}, ${c} (${a < b})`; },
		op: (ip, a, b, c) => { this.mem[c] = a < b ? 1 : 0; return ip + 4; }
	}

	eq = {
		p: [true, true, false],
		debug: (ip, a, b, c) => { return `${this.dass(ip, 4)} eq ${a}, ${b}, ${c} (${a === b})`; },
		op: (ip, a, b, c) => { this.mem[c] = a === b ? 1 : 0; return ip + 4; }
	}

	relative_base = 0;

	rbo = {
		p: [true],
		debug: (ip, a) => { return `${this.dass(ip, 2)} rbo ${a}`; },
		op: (ip, a) => { this.relative_base += a; return ip + 2; }
	}

	instr = [
		this.nop, // 0
		this.add, // 1
		this.mul, // 2
		this.input, // 3
		this.output, // 4
		this.jmt,  // 5
		this.jmf, // 6
		this.less, // 7
		this.eq, // 8
		this.rbo // 9
	];

	constructor(program, stdin, stdout) {
		this.mem = program.split(",").map(c => parseInt(c));
		this.stdin = stdin;
		this.stdout = stdout;
		this.disass = [];
		this.ip = 0;
	}

	run() {
		while (this.mem[this.ip] !== 99) {
			let opcode = this.mem[this.ip];
			if (opcode === 3 && this.stdin.length === 0) return 1;
			let op = this.instr[opcode % 100];
			let a = this.mem[this.ip + 1];
			let b = this.mem[this.ip + 2];
			let c = this.mem[this.ip + 3];
			if (opcode % 1000 < 100 && op.p[0]) a = this.mem[a];
			if (opcode % 1000 > 199) { a += this.relative_base; if (op.p[0]) { a = this.mem[a]; } }
			if (opcode % 10000 < 1000 && op.p[1]) b = this.mem[b];
			if (opcode % 10000 > 1999) { b += this.relative_base; if (op.p[1]) { b = this.mem[b]; } }
			if (opcode % 100000 < 10000 && op.p[2]) c = this.mem[c];
			if (opcode % 100000 > 19999) { c += this.relative_base; if (op.p[2]) { c = this.mem[c]; } }
			// console.log(op.debug(ip, a, b, c));
			// this.disass.push(op.debug(this.ip, a, b, c));
			this.ip = op.op(this.ip, a, b, c);
		}
		return 0;
	}
}

class Robot {
	static up = 0;
	static down = 1;
	static left = 2;
	static right = 3;

	step = [
		{ x: 0, y: -1 },
		{ x: 0, y: 1 },
		{ x: -1, y: 0 },
		{ x: 1, y: 0 }
	];

	turn = [
		[Robot.left, Robot.right, Robot.down, Robot.up],
		[Robot.right, Robot.left, Robot.up, Robot.down]
	];

	facing = Robot.up;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	move(direction) {
		this.facing = this.turn[direction][this.facing];
		this.x += this.step[this.facing].x;
		this.y += this.step[this.facing].y;
	}
}

class Hull {
	surface = [];

	validate(x, y) {
		if (x < 0 || y < 0) throw new Error(`Out of bounds: <${x}, ${y}>`);
		if (this.surface[y] === undefined) this.surface[y] = [];
	}

	get(x, y) {
		this.validate(x, y);
		return this.surface[y][x];
	}

	set(x, y, value) {
		this.validate(x, y);
		this.surface[y][x] = value;
	}

	display(start) {
		let ri = 0, ci = 0;
		let rows = this.surface.filter(r => r !== undefined);
		let maxcol = Math.max(...rows.map(r => r.length));
		rows.forEach(r => {
			for (let i = 0; i < maxcol; i++) { r[i] = r[i] === 1 ? 1 : 0 }
		});
		return <div className="hull-grid">
			{rows.map(r => <div className="hull-row" key={ri++}>{r.map(c => <div className={c === 1 ? "hull-white" : "hull-black"} key={ci++}></div>)}</div>)}
		</div>;
	}
}

export class S11a extends Solver {
	solve(input) {
		let hull = new Hull();
		let stdin = [0];
		let stdout = [];
		let c = new Computer(input, stdin, stdout);
		let rob = new Robot(100, 100);
		while (c.run() === 1) {
			hull.set(rob.x, rob.y, stdout.shift());
			rob.move(stdout.shift());
			stdin.push(hull.get(rob.x, rob.y) === 1 ? 1 : 0);
		}
		this.setState({ hull: hull });
	}

	customRender() {
		return <div>
			{this.state.hull && <p>Panel count: {this.state.hull.surface.reduce((t, n) => t.concat(n)).filter(e => e !== undefined).length}</p>}
			{this.state.error && <p>Error: {this.state.error.message}</p>}
		</div>;
	}
}

export class S11b extends Solver {
	solve(input) {
		let hull = new Hull();
		hull.set(0, 0, 1);
		let stdin = [1];
		let stdout = [];
		let c = new Computer(input, stdin, stdout);
		let rob = new Robot(0, 0);
		while (c.run() === 1) {
			hull.set(rob.x, rob.y, stdout.shift());
			rob.move(stdout.shift());
			stdin.push(hull.get(rob.x, rob.y) === 1 ? 1 : 0);
		}
		this.setState({ hull: hull });
	}

	customRender() {
		return <div>
			{this.state.hull && <CssImage value={this.state.hull.surface} colors={["black", "white"]} />}
			{this.state.hull && <p>Panel count: {this.state.hull.surface.reduce((t, n) => t.concat(n)).filter(e => e !== undefined).length}</p>}
			{this.state.error && <p>Error: {this.state.error.message}</p>}
		</div>;
	}
}