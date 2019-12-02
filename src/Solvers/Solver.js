import './Solver.css';
import React from 'react';

export default class Solver extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.runControls = false;
		this.running = false;
	}

	async solve(input) {
		// This space intentionally left blank
	}

	componentDidMount() {
		if (this.props.input !== null) {
			this.run(false);
		}
	}

	componentDidUpdate(prev) {
		if (this.props.input !== prev.input && this.props.input !== null) {
			this.run(false);
		}
	}

	run(auto) {
		if (this.runControls) {
			this.running = auto;
			if (!this.running)
				return;
		}
		if (this.props.input === null)
			return;

		this.solve(this.props.input);
	}

	solution = p => {
		if (this.customRender) return <this.customRender />;
		if (!this.state.solution) return false;
		let i = 0;
		return this.state.solution.toString().split("\n").map(t => <p key={i++}>{t}</p>);
	}

	render() {
		return <div className="solver">
			<div className="control">
				{this.props.header}
				{this.runControls && <input type="button" value="Solve" onClick={e => this.run(true)} />}
			</div>
			<div className="result">{this.customRender ? this.customRender() : <this.solution />}</div>
		</div>;
	}
}
