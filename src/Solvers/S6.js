import React from 'react';
import Solver from './Solver';

class Orbit {
	constructor(id, orbit) {
		this.id = id;
		this.orbit = orbit;
		this.sat = [];
	}

	setDistance(d) {
		this.dist = d;
		this.sat.forEach(s => s.setDistance(d + 1));
	}

	maxDistance() {
		var d = this.dist;
		this.sat.forEach(s => {
			let sd = s.maxDistance();
			if (sd > d) d = sd;
		});
		return d;
	}

	numberAt(distance) {
		if (distance === this.dist) return 1;
		if (this.sat.length === 0) return 0;
		return this.sat.map(s => s.numberAt(distance)).reduce((t, n) => t + n);
	}
}

export class S6a extends Solver {
	solve(input) {
		let orbits = input.split("\n").map(o => o.split(")")).map(o => new Orbit(o[1], o[0]));
		orbits.push(new Orbit("COM", null));
		let dict = {};
		orbits.forEach(o => { dict[o.id] = o; });
		let count = 0;
		for (var k in dict) {
			let o = dict[k];
			if (o.orbit) { dict[o.orbit].sat.push(o); }
			while (o && o.orbit !== null) {
				o = dict[o.orbit];
				count++;
			}
		}
		let root = dict["COM"];
		root.setDistance(0);
		console.log(root);
		let maxDist = root.maxDistance();
		console.log(maxDist);
		let density = [];
		for (let i = 0; i <= maxDist; i++) {
			density.push(root.numberAt(i));
		}
		console.log(density);

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
		yPath.reverse();
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
			<canvas id="solution" ref="canvas" width="600" height="600" />
			<p>{this.state.path && this.state.path.map(s => <span key={s}>{s}<br /></span>)}</p>
		</div>;
	}
}

export class S6b extends Solver {
	static hide = true;
}