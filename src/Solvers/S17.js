import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S17a extends Solver {
	solve(input) {
		let c = new Computer().init(input);
		while (c.run() === 1);
		let alignment = 0;
		let img = c.stdout.map(c => String.fromCharCode(c)).join("").split("\n").map(l => l.split(""));
		for (let y = 1; y < img.length - 1; y++) {
			for (let x = 1; x < img[y].length - 1; x++) {
				if (img[y][x] === "#" && img[y + 1][x] === "#" && img[y - 1][x] === "#" && img[y][x + 1] === "#" && img[y][x - 1] === "#") {
					alignment += x * y;
					// c.stdout[y * (img[0].length + 1) + x] = "O".charCodeAt(0);
				}
			}
		}
		this.setState({ output: c.stdout, alignment: alignment });
	}

	customRender() {
		let i = 0;
		return <div>
			<p>Alignment: {this.state.alignment}</p>
			{this.state.output && this.state.output.map(c => String.fromCharCode(c)).join("").split("\n").map(s => <p key={i++} style={{ whiteSpace: "pre", fontFamily: "monospace" }}>{s}</p>)}
		</div>;
	}
}

export class S17b extends Solver {
	runControls = true;

	solve(input) {
		let c = new Computer().init(input);
		c.mem[0] = 2;
		for (let i = 0; i < this.state.prg.length; i++) {
			c.stdin.push(this.state.prg.charCodeAt(i));
		}
		c.run();
		let output;
		if (this.state.prg.endsWith("y\n")) {
			output = [];
			while (c.stdout.length > 1) output.push(c.stdout.shift());
		}
		this.setState({ output: output, solved: true, dust: c.stdout[0] });
	}

	customRender() {
		let i = 0;
		return <div>
			<textarea style={{ width: "200px", height: "400px" }} value={this.state.prg} onChange={e => this.setState({ prg: e.target.value })} />
			{this.state.solved && <p>Dust collected: {this.state.dust}</p>}
			{this.state.output && this.state.output.map(c => String.fromCharCode(c)).join("").split("\n").map(s => <p key={i++} style={{ whiteSpace: "pre", fontFamily: "monospace" }}>{s}</p>)}
		</div>;
	}
}