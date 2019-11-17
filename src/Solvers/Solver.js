import './Solver.css';
import React from 'react';
import { thisExpression } from '@babel/types';

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

	solution = p => {
		if (this.customRender) return <this.customRender />;
		if (!this.state.solution) return false;
		return this.state.solution.split("\n").map(t => <p>{t}</p>);
	}

	render() {
		return <div className="solver">
			<div className="control">
				{this.props.header}
				{this.runControls && <input type="button" value="Solve" onClick={this.run} />}
			</div>
			<div className="result">{this.customRender ? this.customRender() : <this.solution />}</div>
		</div>;
	}
}
