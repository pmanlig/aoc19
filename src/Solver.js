import './Solver.css'
import React from 'react'

export class Solver extends React.Component {
	render() {
		return <div className="Solver">
			<p>{this.props.match.params.day}</p>
		</div>
	}
}