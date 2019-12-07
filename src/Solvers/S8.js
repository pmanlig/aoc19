// import React from 'react';
import Solver from './Solver';

export class S8a extends Solver {
	solve(input) {
		this.setState({ solution: input });
	}
}

export class S8b extends Solver {
	runControls = true;

	solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}