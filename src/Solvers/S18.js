import React from 'react';
import Solver from './Solver';

export class S18a extends Solver {
	solve(input) {
		this.setState({ map: input.split("\n").map(l => l.split("")) });
	}

	customRender() {
		let i = 0;
		return <div>
			{this.state.map && this.state.map.map(l => <p key={i++} style={{ fontFamily: "monospace", whiteSpace: "pre" }}>{l.map(c => c === "." ? " " : c).join("")}</p>)}
		</div>;
	}
}

export class S18b extends Solver {
	runControls = true;

	solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}