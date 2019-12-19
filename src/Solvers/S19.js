import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S19a extends Solver {
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
		this.setState({ pulls: count, output: output });
	}

	customRender() {
		let i = 0;
		return <div>
			<p>{this.state.pulls} coordinates pulled</p>
			<div style={{ whiteSpace: "pre", fontFamily: "monospace" }}>
				{this.state.output && this.state.output.split("\n").map(l => <p key={i++}>{l}</p>)}
			</div>
		</div>;
	}
}

export class S19b extends Solver {
	detect(x, y) {
		let comp = new Computer().init(this.program);
		comp.stdin.push(x);
		comp.stdin.push(y);
		comp.run();
		return comp.stdout.shift();
	}

	solve2() {
		let count = 0, minX = 0, minY = 0;
		let output = [];
		let x = 200, y = 400;
		while (count < 10000) {
			count = 0;
			while (this.detect(x, y) === 0) { x++ }
			let startX = x - 1;
			while (this.detect(x, y) === 1) { x++; count++; }
			if (this.detect(x - 100, y + 99) === 1) {
				minX = x - 100;
				minY = y;
				count = 10000;
			}
			y++;
			x = startX;
		}
		this.setState({ pulls: count, output: output, minX: minX, minY: minY });
	}

	solve(input) {
		this.program = input;
		setTimeout(() => this.solve2(), 100);
	}

	customRender() {
		let i = 0;
		return <div>
			<p>Min X: {this.state.minX}</p>
			<p>Min Y: {this.state.minY}</p>
			<p>Value: {this.state.minX && 10000 * this.state.minX + this.state.minY}</p>
			<div style={{ whiteSpace: "pre", fontFamily: "monospace" }}>
				{this.state.output && this.state.output.map(l => <p key={i++}>{l.join("")}</p>)}
			</div>
		</div>;
	}
}