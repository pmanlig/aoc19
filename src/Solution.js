import './Solution.css';
import React from 'react';

export class Solution extends React.Component {
	render() {
		return <div className="solution">
			<div className="day"><h1>Day {this.props.match.params.day}</h1></div>
			<div className="input">input</div>
			<div className="stats">stats</div>
			<div className="part1">part1</div>
			<div className="part2">part2</div>
		</div>
	}
}