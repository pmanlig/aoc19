// import React from 'react';
import Solver from './Solver';

export class S17a extends Solver {
	async solve(input) {
		this.setState({ solution: input });
	}
}

export class S17b extends Solver {
	runControls = true;

	async solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}