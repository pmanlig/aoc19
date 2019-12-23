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
		let ctx = this.refs.canvas.getContext('2d');
		let x = 100, y = 0;
		while (true) {
			ctx.fillStyle = "#CFCFCF";
			while (this.detect(x, y) === 0) {
				ctx.fillRect(x, y, 1, 1);
				y++;
			}
			ctx.fillStyle = "#CF7FCF";
			while (this.detect(x, y) === 1) {
				ctx.fillRect(x, y, 1, 1);
				x++;
			}
			if (this.detect(x - 100, y + 99) === 1) {
				this.setState({ minX: x - 100, minY: y });
				ctx.fillRect(x - 100, y, 100, 100);
				return;
			} else {
				ctx.fillStyle = "#CFCFCF";
				ctx.fillRect(x - 100, y + 99, 1, 1);
			}
		}
	}

	solve(input) {
		let count = 0;
		let ctx = this.refs.canvas.getContext('2d');
		for (let y = 0; y < 50; y++) {
			for (let x = 0; x < 50; x++) {
				let comp = new Computer().init(input);
				comp.stdin.push(x);
				comp.stdin.push(y);
				comp.run();
				let res = comp.stdout.shift();
				if (res === 1) {
					count++;
					ctx.fillStyle = "#CF7FCF";
				}
				if (res === 0) {
					ctx.fillStyle = "#CFCFCF";
				}
				ctx.fillRect(x, y, 1, 1);
			}
		}
		this.program = input;
		this.setState({ pulls: count });
		setTimeout(() => this.solve2(), 10);
	}

	customRender() {
		return <div>
			<p>{this.state.pulls} coordinates pulled</p>
			<p>Min X: {this.state.minX}</p>
			<p>Min Y: {this.state.minY}</p>
			<p>Value: {this.state.minX && 10000 * this.state.minX + this.state.minY}</p>
			<canvas id="solution" ref="canvas" style={{ margin: "10px" }} width="1100" height="1100" />
		</div>;
	}
}

export class S19b extends Solver {
	static hide = true;
}