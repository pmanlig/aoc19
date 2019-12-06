import React from 'react';
import Solver from './Solver';

class Orbit {
	constructor(id, orbit) {
		this.id = id;
		this.orbit = orbit;
	}
}

export class S6a extends Solver {
	async solve(input) {
		let orbits = input.split("\r\n").map(o => o.split(")")).map(o => new Orbit(o[1], o[0]));
		orbits.push(new Orbit("COM", null));
		let dict = {};
		orbits.forEach(o => { dict[o.id] = o; });
		let count = 0;
		for (var k in dict) {
			let o = dict[k];
			while (o && o.orbit !== null) {
				o = dict[o.orbit];
				count++;
			}
		}
		let you = dict["YOU"];
		let san = dict["SAN"];
		let yPath = [];
		let sPath = [];
		while (you.orbit !== null) { yPath.unshift(you.orbit); you = dict[you.orbit]; }
		while (san.orbit !== null) { sPath.unshift(san.orbit); san = dict[san.orbit]; }
		let lcd = "COM";
		while (yPath[0] === sPath[0]) {
			lcd = yPath.shift();
			sPath.shift();
		}
		sPath.reverse();
		yPath.push(lcd);
		let path = yPath.concat(sPath);
		this.setState({
			orbits: orbits,
			count: count,
			path: path,
			solution: `Orbits: ${orbits.length}\nCount: ${count}\nHops from you to santa: ${path.length - 1}\n${path.join("\n")}`
		});
	}

	customRender = p => {
		return <div>
			<p>Orbits: {this.state.orbits && this.state.orbits.length}</p>
			<p>Count: {this.state.count}</p>
			<p>Hops from you to santa: {this.state.path && this.state.path.length - 1}</p>
			<p>{this.state.path && this.state.path.map(s => <span key={s}>{s}<br /></span>)}</p>
		</div>;
	}
}

export class S6b extends Solver {
	static hide = true;
}