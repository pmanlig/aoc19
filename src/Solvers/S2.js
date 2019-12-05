// import React from 'react';
import Solver from './Solver';

function calc(input, noun, verb) {
	if (input === null) return;
	let mem = input.split(",").map(s => parseInt(s));
	let ip = 0;
	if (noun)
		mem[1] = noun;
	if (verb)
		mem[2] = verb;
	while (mem[ip] !== 99) {
		let a = mem[ip + 1];
		let b = mem[ip + 2];
		let c = mem[ip + 3];
		a = mem[a];
		b = mem[b];
		if (mem[ip] === 1) {
			mem[c] = a + b;
		} else if (mem[ip] === 2) {
			mem[c] = a * b;
		}
		ip += 4;
	}
	return mem;
}

export class S2a extends Solver {
	async solve(input) {
		let res = calc(input, 12, 2);
		this.setState({ solution: res && res.reduce((t, n) => t + ",\n" + n) });
	}
}

export class S2b extends Solver {
	async solve(input) {
		let answer = 0;
		for (var noun = 0; noun < 100; noun++) {
			for (var verb = 0; verb < 100; verb++) {
				let mem = calc(input, noun, verb);
				if (mem[0] === 19690720) {
					answer = 100 * noun + verb;
					this.setState({ solution: `Answer: ${answer}\n` + mem.reduce((t, n) => t + ",\n" + n) });
				}
			}
		}
	}
}