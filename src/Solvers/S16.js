// import React from 'react';
import Solver from './Solver';

function pattern(n, l) {
	let res = [];
	res[l - 1] = 0;
	res.fill(0, 0);
	let i = n - 1;
	while (i < l) {
		res.fill(1, i, i + n);
		i += 2 * n;
		res.fill(-1, i, i + n);
		i += 2 * n;
	}
	return res;
}

function fft(input, times) {
	for (let n = 0; n < times; n++) {
		let res = [];
		for (let r = 0; r < input.length; r++) {
			let p = pattern(r + 1, input.length);
			res[r] = input[r];
			for (let i = r + 1; i < input.length; i++) {
				res[r] += input[i] * p[i];
				res[r] = res[r] % 10;
			}
			res[r] = Math.abs(res[r] % 10);
		}
		input = res;
	}
	return input;
}

export class S16a extends Solver {
	solve(input) {
		input = input.split("").map(d => parseInt(d));
		let offset = parseInt(input.slice(0, 7).join(""));
		let first8 = fft(input, 100).slice(0, 8).join("");
		let result = [];
		for (let n = 0; n < 6; n++) { result = result.concat(input); }
		let pos = result.length - 33;
		let off = [0, 1, 2, 3, 4];
		console.log(result.join(""));
		for (let i = 0; i < 100; i++) {
			if (i % 5 in off) console.log(`${i}: ${result[pos]}`);
			result = fft(result, 1);
		}
		if (0 in off) console.log("100: " + result[pos]);
		console.log(result.join(""));
		this.setState({ solution: `Input length: ${input.length}\nFirst 8: ${first8}\nOffset: ${offset}\nMessage: ${result.slice(offset, offset + 8).join("")}` });
	}
}

export class S16b extends Solver {
	static hide = true;
}