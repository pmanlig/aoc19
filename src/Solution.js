import './Solution.css';
import React from 'react';
import Input from './Input';

export class Solution extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.loadInput();
	}

	async loadInput() {
		if (this.props.match.params.day) {
			try {
				let res = await fetch(`${this.props.match.params.day}.txt`);
				if (res.ok) {
					let txt = await res.text();
					if (!txt.startsWith("<!DOCTYPE html>"))
						this.setState({ input: txt });
				}
			} catch {
			}
		}
	}

	render() {
		let s = this.props.solvers[this.props.match.params.day - 1];
		return <div className="solution">
			<div className="day"><h1>Day {this.props.match.params.day}</h1></div>
			<Input value={this.state.input} onChange={e => this.setState({ input: e.target.value })} />
			{s ? <s.a header="Part 1:" input={this.state.input} /> : <div className="part1">part1</div>}
			{s ? <s.b header="Part 2:" input={this.state.input} /> : <div className="part2">part1</div>}
		</div>
	}
}