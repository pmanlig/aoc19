// import React from 'react';
import Solver from './Solver';

export class S14a extends Solver {
	async solve(input) {
		this.setState({ solution: input });
	}
}

export class S14b extends Solver {
	runControls = true;

	async solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}