// import React from 'react';
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
	bounds = { u: 0, d: 0, l: 0, r: 0 };
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

	toString() {
		return `Wire:\n#coordinates: ${this.coordinates.length}\nbounds: [ Up:${this.bounds.u}, Down:${this.bounds.d}, Left:${this.bounds.l}, Right:${this.bounds.r}]`;
	}
}

export class S3a extends Solver {
	async solve(input) {
		let grid = new Grid();
		let wires = input.split("\n");
		let wireA = new Wire(wires[0], grid);
		let wireB = new Wire(wires[1]);
		wireA.markGrid(grid);
		let intersections = wireB.findIntersections(grid);
		let distance = 0;
		intersections.forEach(i => {
			if (distance === 0 || i.distance() < distance) distance = i.distance();
		});

		this.setState({ solution: `${wireA.toString()}\n${wireB.toString()}\nIntersections: ${intersections.length}\nDistance: ${distance}` });
	}
}

export class S3b extends Solver {
	async solve(input) {
		let grid = new Grid();
		let wires = input.split("\n");
		let wireA = new Wire(wires[0], grid);
		let wireB = new Wire(wires[1]);
		wireA.markGrid(grid);
		let intersections = wireB.findIntersections(grid);
		let delay = 0;
		intersections.forEach(i => {
			let d = wireA.distAlong(i) + wireB.distAlong(i);
			if (delay === 0 || d < delay) delay = d;
		});

		this.setState({ solution: `${wireA.toString()}\n${wireB.toString()}\nIntersections: ${intersections.length}\nDelay: ${delay}` });
	}
}