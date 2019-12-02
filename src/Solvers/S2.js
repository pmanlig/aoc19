// import React from 'react';
import Solver from './Solver';

async function calc(input, noun, verb) {
	if (input === undefined) return input;
	let mem = input.split(",").map(s => parseInt(s));
	let ip = 0;
	mem[1] = noun;
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
		if (input !== undefined) {
			let mem = await calc(input, 12, 2);
			this.setState({ solution: mem.reduce((t, n) => t + ",\n" + n) });
		} else
			this.setState({ solution: input });
	}
}

export class S2b extends Solver {
	async solve(input) {
		if (input !== undefined) {
			let answer = 0;
			for (var noun = 0; noun < 100; noun++) {
				for (var verb = 0; verb < 100; verb++) {
					let mem = await calc(input, noun, verb);
					if (mem[0] === 19690720) {
						answer = 100 * noun + verb;
						this.setState({ solution: `Answer: ${answer}\n` + mem.reduce((t, n) => t + ",\n" + n) });
					}
				}
			}
		} else
			this.setState({ solution: input });
	}
}