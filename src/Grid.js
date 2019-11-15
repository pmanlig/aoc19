import './Grid.css'
import React from 'react'
import { Link } from 'react-router-dom';

export class Grid extends React.Component {
	constructor(props) {
		super(props);
		// props.match.params.day;
	}

	render() {
		return <div className="grid">
			{Array.apply(null, { length: 25 }).map((e, i) =>
				<div key={i}><Link to={"/" + (i + 1)}>{i + 1}</Link></div>
			)}
		</div>
	}
}