import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S19a extends Solver {
	detect(x, y) {
		let comp = new Computer().init(this.program);
		comp.stdin.push(x);
		comp.stdin.push(y);
		comp.run();
		return comp.stdout.shift();
	}

	solve2() {
		let x = 100, y = 0;
		while (true) {
			while (this.detect(x, y) === 0) { y++ }
			while (this.detect(x, y) === 1) { x++ }
			if (this.detect(x - 100, y + 99) === 1) {
				return { minX: x - 100, minY: y };
			}
		}
	}

	solve(input) {
		let count = 0;
		let output = "";
		for (let y = 0; y < 50; y++) {
			for (let x = 0; x < 50; x++) {
				let comp = new Computer().init(input);
				comp.stdin.push(x);
				comp.stdin.push(y);
				comp.run();
				let res = comp.stdout.shift();
				if (res === 1) {
					count++;
					output += "#";
				}
				if (res === 0) output += (".");
			}
			output += "\n";
		}
		this.program = input;
		let pos = this.solve2();
		console.log(pos);
		this.setState({ pulls: count, output: output, minX: pos.minX, minY: pos.minY });
	}

	customRender() {
		let i = 0;
		return <div>
			<p>{this.state.pulls} coordinates pulled</p>
			<p>Min X: {this.state.minX}</p>
			<p>Min Y: {this.state.minY}</p>
			<p>Value: {this.state.minX && 10000 * this.state.minX + this.state.minY}</p>
			<div style={{ whiteSpace: "pre", fontFamily: "monospace" }}>
				{this.state.output && this.state.output.split("\n").map(l => <p key={i++}>{l}</p>)}
			</div>
		</div>;
	}
}

export class S19b extends Solver {
	static hide = true;
}