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

	setWidth() {
		this.sat.forEach(s => s.setWidth());
		if (this.sat.length === 0) this.width = 1;
		else this.width = this.sat.map(s => s.width).reduce((t, n) => t + n);
	}

	setY(start) {
		this.y = start + Math.floor(this.width / 2);
		this.sat.forEach(s => {
			s.setY(start);
			start += s.width;
		});
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

	draw(ctx, offsetX, offsetY, scaleX, scaleY, style) {
		ctx.strokeStyle = style;
		ctx.lineWidth = 1;
		if (this.up) {
			ctx.beginPath();
			ctx.moveTo(this.up.dist * scaleX + offsetX, this.up.y * scaleY + offsetY);
			ctx.lineTo(this.dist * scaleX + offsetX, this.y * scaleY + offsetY);
			ctx.stroke();
		}
	}

	drawTree(ctx, offsetX, offsetY, scaleX, scaleY, style) {
		this.draw(ctx, offsetX, offsetY, scaleX, scaleY, style);
		this.sat.forEach(s => s.drawTree(ctx, offsetX, offsetY, scaleX, scaleY, style));
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
			if (o.orbit) {
				o.up = dict[o.orbit];
				o.up.sat.push(o);
			}
			while (o && o.orbit !== null) {
				o = dict[o.orbit];
				count++;
			}
		}
		let root = dict["COM"];
		root.setDistance(0);
		let maxDist = root.maxDistance();
		let density = [];
		for (let i = 0; i <= maxDist; i++) {
			density.push(root.numberAt(i));
		}
		root.setWidth();
		root.setY(0);
		console.log(root);

		let scaleY = 560 / maxDist;
		let scaleX = 500 / root.width;
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, 600, 600);
		root.drawTree(ctx, 20, 50, scaleX, scaleY, "#00FF00");

		let you = dict["YOU"];
		let san = dict["SAN"];
		you.draw(ctx, 20, 50, scaleX, scaleY, "#FF0000");
		san.draw(ctx, 20, 50, scaleX, scaleY, "#FF0000");
		let yPath = [];
		let sPath = [];
		while (you.orbit !== null) { yPath.unshift(you.up); you = you.up; }
		while (san.orbit !== null) { sPath.unshift(san.up); san = san.up; }
		let lcd = null;
		while (yPath[0].id === sPath[0].id) {
			lcd = yPath.shift();
			sPath.shift();
		}
		yPath.forEach(p => { p.draw(ctx, 20, 50, scaleX, scaleY, "#FF0000"); });
		sPath.forEach(p => { p.draw(ctx, 20, 50, scaleX, scaleY, "#FF0000"); });
		yPath.reverse();
		yPath.push(lcd);
		let path = yPath.concat(sPath);
		this.setState({
			orbits: orbits,
			count: count,
			path: path
		});
	}

	customRender = p => {
		return <div>
			<p>Orbits: {this.state.orbits && this.state.orbits.length}</p>
			<p>Count: {this.state.count}</p>
			<p>Hops from you to santa: {this.state.path && this.state.path.length - 1}</p>
			<canvas id="solution" ref="canvas" width="600" height="600" />
			{false && this.state.path && <p>{this.state.path.map(s => <span key={s}>{s}<br /></span>)}</p>}
		</div>;
	}
}

export class S6b extends Solver {
}