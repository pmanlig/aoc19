// import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

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
			let c = new Computer().init(input, [phase[p], i], []);
			c.run();
			i = c.stdout[0];
		}
		return i;
	}

	calc2(program, phase) {
		let p1 = [phase[0], 0],
			p2 = [phase[1]],
			p3 = [phase[2]],
			p4 = [phase[3]],
			p5 = [phase[4]];
		let amps = [
			new Computer().init(program, p1, p2),
			new Computer().init(program, p2, p3),
			new Computer().init(program, p3, p4),
			new Computer().init(program, p4, p5),
			new Computer().init(program, p5, p1),
		];
		while (amps.length > 0) {
			let amp = amps.shift();
			if (amp.run() === 1) amps.push(amp);
		}
		return p1[0];
	}

	solve(input) {
		let res = 0;
		let phase = [0, 1, 2, 3, 4];
		combine(phase, x => {
			let p = this.calc(input, x);
			if (p > res) res = p;
		});

		let res2 = 0;
		let phase2 = [5, 6, 7, 8, 9];
		combine(phase2, x => {
			let p = this.calc2(input, x);
			console.log(`[${x.join()}] => ${p}`);
			if (p > res2) res2 = p;
		});

		this.setState({ solution: `Maximum signal: ${res}\nMaximum signal with feedback loop: ${res2}` });
	}
}

export class S7b extends Solver {
}