// import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S9a extends Solver {
	solve(input) {
		let stdout = [];
		new Computer().init(input, [1], stdout).run();
		this.setState({ solution: `Output: [${stdout.join()}]` });
	}
}

export class S9b extends Solver {
	solve(input) {
		let stdout = [];
		new Computer().init(input, [2], stdout).run();
		this.setState({ solution: `Output: [${stdout.join()}]` });
	}
}