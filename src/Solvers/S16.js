import React from 'react';
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
		let p = input.length;
		let scratch = [];
		scratch[100] = input[p - 1];
		scratch.fill(input[p - 1], 0, 100);
		let result = [];
		for (let i = 10000 * p - 2; i >= offset; i--) {
			scratch[0] = input[i % p];
			for (let j = 1; j < 101; j++) {
				scratch[j] = (scratch[j] + scratch[j - 1]) % 10;
			}
			if (i - offset < 8 && i - offset > -1) { result[i - offset] = scratch[100]; }
		}
		this.setState({
			length: input.length,
			first8: first8,
			offset: offset,
			fromEnd: offset - 10000 * input.length,
			relative: offset / (input.length * 10000),
			message: result.join("")
		});
	}

	customRender() {
		return <div>
			<p>Input length: {this.state.length}</p>
			<p>First 8: {this.state.first8}</p>
			<p>Offset: {this.state.offset}</p>
			<p>From end: {this.state.fromEnd}</p>
			<p>Relative: {this.state.relative}</p>
			<p>Message: {this.state.message}</p>
		</div>;
	}
}

export class S16b extends Solver {
	static hide = true;
}