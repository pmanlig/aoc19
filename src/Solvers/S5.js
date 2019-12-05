// import React from 'react';
import Solver from './Solver';

function fill(num, positions) {
	let res = num.toString();
	while (res.length < positions) res = "0" + res;
	return res;
}

function dass(mem, ip, positions) {
	let i = ip;
	let m = [];
	while (positions-- > 0) { m.push(fill(mem[i++], 5)); }
	return `${fill(ip, 4)}: {${m.join(", ")}}`;
}

function calc(mem, stdin) {
	let stdout = [];
	let disass = [];
	let instr = [
		{ op: (mem, ip) => { disass.push(`${dass(mem, ip, 4)} NOP`); return ip + 1; }, p: [] },
		{ op: (mem, ip, a, b, c) => { mem[c] = a + b; disass.push(`${dass(mem, ip, 4)} mem[${c}] = ${a}+${b} (${mem[c]})`); return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a, b, c) => { mem[c] = a * b; disass.push(`${dass(mem, ip, 4)} mem[${c}] = ${a}*${b} (${mem[c]})`); return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a) => { mem[a] = stdin.shift(); disass.push(`${dass(mem, ip, 2)} input mem[${a}] (${mem[a]})`); return ip + 2; }, p: [false] },
		{ op: (mem, ip, a) => { stdout.push(a); disass.push(`${dass(mem, ip, 2)} output ${a}`); return ip + 2; }, p: [true] },
		{ op: (mem, ip, a, b) => { disass.push(`${dass(mem, ip, 3)} jmt ${a}, ${b}`); return a ? b : ip + 3; }, p: [true, true] },
		{ op: (mem, ip, a, b) => { disass.push(`${dass(mem, ip, 3)} jmf ${a}, ${b}`); return a ? ip + 3 : b; }, p: [true, true] },
		{ op: (mem, ip, a, b, c) => { disass.push(`${dass(mem, ip, 4)} less ${a}, ${b}, ${c} (${a < b})`); mem[c] = a < b ? 1 : 0; return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a, b, c) => { disass.push(`${dass(mem, ip, 4)} eq ${a}, ${b}, ${c} (${a === b})`); mem[c] = a === b ? 1 : 0; return ip + 4; }, p: [true, true, false] },
	];

	let ip = 0;
	while (mem[ip] !== 99) {
		let opcode = mem[ip];
		let op = instr[opcode % 100];
		let a = mem[ip + 1];
		let b = mem[ip + 2];
		let c = mem[ip + 3];
		if (opcode % 1000 < 100 && op.p[0]) a = mem[a];
		if (opcode % 10000 < 1000 && op.p[1]) b = mem[b];
		if (opcode % 100000 < 10000 && op.p[2]) c = mem[c];
		ip = op.op(mem, ip, a, b, c);
	}

	return { mem: mem, stdout: stdout, disassembly: disass };
}

function format(mem) {
	let cnt = 0;
	let res = `\n${fill(cnt, 3)}: `;
	while (mem.length > 10) {
		cnt += 10;
		let sub = [];
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		sub.push(mem.shift());
		res += `${sub.join()}\n${cnt}: `;
	}
	return res + mem.join();
}

export class S5a extends Solver {
	state = { input: 1 }

	async solve(input) {
		if (input) {
			let mem = input.split(",").map(s => parseInt(s));
			let stdin = [this.state.input];
			let res = calc(mem, stdin);
			this.setState({ solution: `Input: ${this.state.input}\nMemory Size: ${mem.length}\nOutput: [${res.stdout.join()}]\nLog:\n${res.disassembly.join("\n")}\nMemory: [${format(res.mem)}]` });
		}
	}
}

export class S5b extends Solver {
	state = { input: 5 }

	async solve(input) {
		if (input) {
			let mem = input.split(",").map(s => parseInt(s));
			let stdin = [this.state.input];
			let res = calc(mem, stdin);
			this.setState({ solution: `Input: ${this.state.input}\nMemory Size: ${mem.length}\nOutput: [${res.stdout.join()}]\nLog:\n${res.disassembly.join("\n")}\nMemory: [${format(res.mem)}]` });
		}
	}
}