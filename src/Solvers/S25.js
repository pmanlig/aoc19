import React from 'react';
import Solver from './Solver';

export class S25a extends Solver {
	async solve(input) {
		this.setState({ solution: input });
	}
}

export class S25b extends Solver {
	runControls = true;

	async solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}

	run = () => {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.moveTo(0, 0);
		ctx.lineTo(200, 200);
		ctx.stroke();
		ctx.moveTo(0, 200);
		ctx.lineTo(200, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(100, 100, 75, 0, 2 * Math.PI);
		ctx.stroke();
	}

	customRender() {
		return <canvas id="solution" ref="canvas" width="200" height="200" />;
	}
}