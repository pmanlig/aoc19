import React from 'react';
import Solver from './Solver';

class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance() {
		return Math.abs(this.x) + Math.abs(this.y);
	}

	toString() {
		return `{ x: ${this.x}, y: ${this.y}}`;
	}
}

class Envelope {
	constructor(u, d, l, r) {
		this.u = u;
		this.d = d;
		this.l = l;
		this.r = r;
	}

	union(other) {
		return new Envelope(Math.max(this.u, other.u), Math.min(this.d, other.d), Math.min(this.l, other.l), Math.max(this.r, other.r));
	}
}

class Grid {
	g = [];

	constructor(cutoff) {
		this.cutoff = cutoff;
	}

	get(x, y) {
		if (!this.g[x]) this.g[x] = [];
		return this.g[x][y];
	}

	set(x, y, val) {
		if (!this.g[x]) this.g[x] = [];
		this.g[x][y] = val;
	}
}

class Wire {
	instructions = [];
	coordinates = [new Coordinate(0, 0)];
	bounds = new Envelope(0, 0, 0, 0);
	f = [];

	constructor(input) {
		this.f["U"] = new Coordinate(0, 1);
		this.f["D"] = new Coordinate(0, -1);
		this.f["L"] = new Coordinate(-1, 0);
		this.f["R"] = new Coordinate(1, 0);
		this.calculateCoordinates(input.split(","));
		this.calculateBounds();
	}

	calculateCoordinates(instructions) {
		this.instructions = instructions;
		for (var i = 0; i < instructions.length; i++) {
			let x = instructions[i];
			let v = this.f[x[0]];
			let d = parseInt(x.substring(1));
			let f = this.coordinates[i];
			let t = new Coordinate(f.x + v.x * d, f.y + v.y * d);
			/*
			while (d > 0) {
				t.x += v.x;
				t.y += v.y;
				d--;
				this.grid.set(t.x, t.y, 1);
			}
			*/
			this.coordinates[i + 1] = t;
		}
	}

	markGrid(grid) {
		grid.set(0, 0, 1);
		for (var i = 0; i < this.instructions.length; i++) {
			let x = this.instructions[i];
			let v = this.f[x[0]];
			let d = parseInt(x.substring(1));
			let f = this.coordinates[i];
			let t = new Coordinate(f.x, f.y);
			while (d > 0) {
				t.x += v.x;
				t.y += v.y;
				d--;
				grid.set(t.x, t.y, 1);
			}
		}
	}

	findIntersections(grid) {
		let res = [];
		for (var i = 0; i < this.instructions.length; i++) {
			let x = this.instructions[i];
			let v = this.f[x[0]];
			let d = parseInt(x.substring(1));
			let f = this.coordinates[i];
			let t = new Coordinate(f.x, f.y);
			while (d > 0) {
				t.x += v.x;
				t.y += v.y;
				d--;
				if (grid.get(t.x, t.y) !== undefined) res.push(new Coordinate(t.x, t.y));
			}
		}
		return res;
	}

	distAlong(coord) {
		let dist = 0;
		for (var i = 0; i < this.instructions.length; i++) {
			let x = this.instructions[i];
			let v = this.f[x[0]];
			let d = parseInt(x.substring(1));
			let f = this.coordinates[i];
			let t = new Coordinate(f.x, f.y);
			while (d > 0) {
				t.x += v.x;
				t.y += v.y;
				d--;
				dist++;
				if (t.x === coord.x && t.y === coord.y) {
					return dist;
				}
			}
		}
		return dist;
	}

	calculateBounds() {
		this.coordinates.forEach(c => {
			if (c.x > this.bounds.r) this.bounds.r = c.x;
			if (c.x < this.bounds.l) this.bounds.l = c.x;
			if (c.y > this.bounds.u) this.bounds.u = c.y;
			if (c.y < this.bounds.d) this.bounds.d = c.y;
		});
	}

	draw(ctx, scaling, style) {
		ctx.strokeStyle = style;
		ctx.beginPath();
		ctx.moveTo(250, 250);
		for (var i = 1; i < this.coordinates.length; i++) {
			let x = 250 + Math.round(250 * this.coordinates[i].x / scaling);
			let y = 250 - Math.round(250 * this.coordinates[i].y / scaling);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	}

	toString() {
		return `Wire:\n#coordinates: ${this.coordinates.length}\nbounds: [ Up:${this.bounds.u}, Down:${this.bounds.d}, Left:${this.bounds.l}, Right:${this.bounds.r}]`;
	}
}

export class S3a extends Solver {
	state = {}

	async solve(input) {
		let grid = new Grid();
		let wires = input.split("\n");
		let wireA = new Wire(wires[0], grid);
		let wireB = new Wire(wires[1]);
		wireA.markGrid(grid);
		let intersections = wireB.findIntersections(grid);
		let distance = 0;
		let distCoord = 0;
		intersections.forEach(i => {
			if (distance === 0 || i.distance() < distance) {
				distance = i.distance();
				distCoord = i;
			}
		});
		let delay = 0;
		let delCoord;
		intersections.forEach(i => {
			let d = wireA.distAlong(i) + wireB.distAlong(i);
			if (delay === 0 || d < delay) {
				delay = d;
				delCoord = i;
			}
		});

		let bounds = wireA.bounds.union(wireB.bounds);
		let scaling = 100 * (Math.floor(Math.max(bounds.u, -bounds.d, -bounds.l, bounds.r) / 100) + 1);

		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, 500, 500);
		wireA.draw(ctx, scaling, "#00FF00");
		wireB.draw(ctx, scaling, "#0000FF");
		this.drawCircle(ctx, distCoord, 5, scaling, "#FF0000", 3);
		this.drawCircle(ctx, delCoord, 5, scaling, "#FF0000", 3);
		this.drawOrigin(ctx, 20, scaling, "#3F3F3F");

		this.setState({ wireA: wireA, wireB: wireB, intersections: intersections, distance: distance, distCoord: distCoord, delay: delay, delCoord: delCoord, scaling: scaling });
	}

	drawOrigin(ctx, size, scaling, style) {
		ctx.strokeStyle = style;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(250 - size, 250);
		ctx.lineTo(250 + size, 250);
		ctx.stroke();
		ctx.moveTo(250, 250 - size);
		ctx.lineTo(250, 250 + size);
		ctx.stroke();
		this.drawCircle(ctx, new Coordinate(0, 0), size * 0.75, scaling, style, 1);
	}

	drawCircle(ctx, coord, radius, scaling, style, lineWidth) {
		let x = 250 + Math.round(250 * coord.x / scaling);
		let y = 250 - Math.round(250 * coord.y / scaling);
		ctx.strokeStyle = style;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}

	customRender() {
		let bounds = { u: 0, d: 0, l: 0, r: 0 };
		if (this.state.wireA && this.state.wireB) {
			bounds = this.state.wireA.bounds.union(this.state.wireB.bounds);
		}

		return <div>
			<canvas id="solution" ref="canvas" width="500" height="500" />
			<p>Wire A: {this.state.wireA && this.state.wireA.coordinates.length} coordinates</p>
			<p>Wire B: {this.state.wireA && this.state.wireA.coordinates.length} coordinates</p>
			<p>Bounds: [ Up: {bounds.u}, Down: {bounds.d}, Left: {bounds.l}, Right: {bounds.r}]</p>
			<p>{this.state.intersections && this.state.intersections.length} intersections</p>
			<p>Distance to closest intersection: {this.state.distance} {this.state.distCoord && `(${this.state.distCoord.x},${this.state.distCoord.y})`}</p>
			<p>Delay to closest intersection: {this.state.delay} {this.state.distCoord && `(${this.state.delCoord.x},${this.state.delCoord.y})`}</p>
			<p>Scaling: {this.state.scaling}</p>
		</div>;
	}
}

export class S3b extends Solver {
	static hide = true;
}