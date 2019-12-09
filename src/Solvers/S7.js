// import React from 'react';
import Solver from './Solver';

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

	instr = [
		this.nop,
		this.add,
		this.mul,
		this.input,
		this.output,
		this.jmt,
		this.jmf,
		this.less,
		this.eq
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
			if (opcode % 10000 < 1000 && op.p[1]) b = this.mem[b];
			if (opcode % 100000 < 10000 && op.p[2]) c = this.mem[c];
			// console.log(op.debug(ip, a, b, c));
			// this.disass.push(op.debug(this.ip, a, b, c));
			this.ip = op.op(this.ip, a, b, c);
		}
		return 0;
	}
}

function combine(arr, f) {
	arr.forEach(p1 => {
		arr.forEach(p2 => {
			if (p2 !== p1) arr.forEach(p3 => {
				if (p3 !== p2 && p3 !== p1) arr.forEach(p4 => {
					if (p4 !== p3 && p4 !== p2 && p4 !== p1) arr.forEach(p5 => {
						if (p5 !== p4 && p5 !== p3 && p5 !== p2 && p5 !== p1) f([p1, p2, p3, p4, p5]);
					});
				});
			});
		});
	});
}

export class S7a extends Solver {
	calc(input, phase) {
		let i = 0;
		for (var p = 0; p < 5; p++) {
			let c = new Computer(input, [phase[p], i], []);
			c.run();
			i = c.stdout[0];
		}
		return i;
	}

	solve(input) {
		let res = 0;
		let phase = [0, 1, 2, 3, 4];
		combine(phase, x => {
			// console.log("Input: [" + x.join() + "]");
			let p = this.calc(input, x);
			// console.log("Result: " + p);
			if (p > res) res = p;
		});

		this.setState({ solution: res });
	}
}

export class S7b extends Solver {
	calc(program, phase) {
		let p1 = [phase[0], 0], p2 = [phase[1]], p3 = [phase[2]], p4 = [phase[3]], p5 = [phase[4]];
		let amps = [
			new Computer(program, p1, p2),
			new Computer(program, p2, p3),
			new Computer(program, p3, p4),
			new Computer(program, p4, p5),
			new Computer(program, p5, p1),
		];
		while (amps.length > 0) {
			let amp = amps.shift();
			if (amp.run() === 1) amps.push(amp);
		}
		/*
		console.log(`P1: [${p1.join()}]`);
		console.log(`P2: [${p2.join()}]`);
		console.log(`P3: [${p3.join()}]`);
		console.log(`P4: [${p4.join()}]`);
		console.log(`P5: [${p5.join()}]`);
		*/
		return p1[0];
	}

	solve(input) {
		let res = 0;
		let phase = [5, 6, 7, 8, 9];
		// phase = [9, 8, 7, 6, 5];
		// res = this.calc(input, phase);
		// this.setState({ solution: res });
		// return;
		combine(phase, x => {
			let p = this.calc(input, x);
			console.log(`[${x.join()}] => ${p}`);
			if (p > res) res = p;
		});
		this.setState({ solution: res });
	}
}