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
		this.solve(this.props.input);
	}

	componentDidUpdate(prev) {
		if (this.props.input !== prev.input) {
			this.running = false;
			this.solve(this.props.input);
		}
	}

	run = () => {
		this.running = true;
		this.solve(this.props.input);
	}

	render() {
		return <div className="solver">
			<div className="control">
				{this.props.header}
				{this.runControls && <input type="button" value="Solve" onClick={this.run} />}
			</div>
			<div className="result">{this.state.solution && this.state.solution.split("\n").map(t => <p>{t}</p>)}</div>
		</div>;
	}
}
