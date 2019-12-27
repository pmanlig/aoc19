// import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S9a extends Solver {
	solve(input) {
		let comp1 = new Computer().init(input, [1]);
		comp1.run();
		let comp2 = new Computer().init(input, [2]);
		comp2.run();
		this.setState({ solution: `BOOST keycode: ${comp1.stdout.join()}\nDistress signal coordinate: ${comp2.stdout.join()}` });
	}
}

export class S9b extends Solver {
}