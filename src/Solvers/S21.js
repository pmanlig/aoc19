import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S21a extends Solver {
	state = {
		springCode1: "NOT C J\nAND D J\nNOT A T\nOR T J\nWALK\n",
		springCode2: "NOT A J\nNOT B T\nOR T J\nNOT C T\nOR T J\nAND D J\nNOT E T\nNOT T T\nOR H T\nAND T J\nRUN\n"
	}

	solve(input) {
		this.setState({ program: input });
	}

	runProgram(code) {
		let comp = new Computer().init(this.state.program);
		for (let i = 0; i < code.length; i++) {
			comp.stdin.push(code.charCodeAt(i));
		}
		comp.run();
		let result = {};
		if (comp.stdout[comp.stdout.length - 1] > 255) {
			result.answer = comp.stdout[comp.stdout.length - 1];
		}
		result.output = "";
		while (comp.stdout.length > 0) {
			result.output += String.fromCharCode(comp.stdout.shift());
		}
		return result;
	}

	customRender() {
		let i = 0;
		return <div style={{ display: "flex", flexDirection: "row" }}>
			<div style={{ display: "inline", marginRight: "10px" }}>
				<p>Part 1:</p>
				<textarea rows="16" cols="20" value={this.state.springCode1} onChange={e => this.setState({ springCode1: e.target.value })} />
				<p><input type="button" value="Walk" onClick={() => { let r = this.runProgram(this.state.springCode1); this.setState({ answer1: r.answer, output: r.output }); }} /></p>
				<p>Answer: {this.state.answer1}</p>
				<p>Part 2:</p>
				<textarea rows="16" cols="20" value={this.state.springCode2} onChange={e => this.setState({ springCode2: e.target.value })} />
				<p><input type="button" value="Run" onClick={() => { let r = this.runProgram(this.state.springCode2); this.setState({ answer2: r.answer, output: r.output }); }} /></p>
				<p>Answer: {this.state.answer2}</p>
			</div>
			{this.state.output && <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
				{this.state.output.split("\n").map(l => <p key={i++}>{l}</p>)}
			</div>}
		</div>;
	}
}

export class S21b extends Solver {
	static hide = true;
}