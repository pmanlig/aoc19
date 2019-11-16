import './Solution.css';
import React from 'react';
import Input from './Input';
import AppHeader from './AppHeader';

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
		let day = parseInt(this.props.match.params.day);

		if (day < 1 || day > 25) return <div>
			<AppHeader/>
			<h1>404 - No such day in Advent of Code!</h1>
		</div>

		let s = this.props.solvers[day - 1];
		return <div className="App">
			<AppHeader day={day} />
			<div className="solution">
				<div className="data">
					<Input value={this.state.input} onChange={e => this.setState({ input: e.target.value })} />
					{s ? <s.a header="Part 1:" input={this.state.input} /> : <div className="part1">part1</div>}
					{s ? <s.b header="Part 2:" input={this.state.input} /> : <div className="part2">part1</div>}
				</div>
			</div>
		</div>
	}
}