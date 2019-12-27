import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';
import { drawFilledRect } from '../util';

const north = { c: 1, x: 0, y: -1 };
const south = { c: 2, x: 0, y: 1 };
const west = { c: 3, x: -1, y: 0 };
const east = { c: 4, x: 1, y: 0 };

const wall = 0;
const open = 1;
const oxygen = 2;

const colors = [
	"#000000",
	"#7F7F7F",
	"#7F7FCF"
]

class Map {
	map = [];

	get(x, y) {
		if (this.map[y] === undefined) this.map[y] = [];
		return this.map[y][x];
	}

	set(x, y, value) {
		if (this.map[y] === undefined) this.map[y] = [];
		this.map[y][x] = value;
	}

	height() { return this.map.length; }
	width() { return Math.max(...this.map.map(r => r === undefined ? 0 : r.length)); }
}

export class S15a extends Solver {
	pixel_size = 5;

	transform(c) {
		return (c + 50) * this.pixel_size;
	}

	setPos(x, y, terrain) {
		this.map.set(x, y, terrain);
		if (this.refs.canvas) {
			const ctx = this.refs.canvas.getContext('2d');
			x = this.transform(x);
			y = this.transform(y);
			drawFilledRect(ctx, x, y, x + this.pixel_size, y + this.pixel_size, colors[terrain]);
		}
	}

	appendPath(p, dir) {
		let n = { comp: p.comp.copy(), pos: { x: p.pos.x + dir.x, y: p.pos.y + dir.y }, path: [...p.path, dir] };
		n.comp.stdin.push(dir.c);
		n.comp.run();
		let res = n.comp.stdout.shift();
		this.setPos(n.pos.x, n.pos.y, res);
		if (res !== wall) this.paths.push(n);
	}

	search() {
		let p = this.paths.shift();
		let terrain = this.map.get(p.pos.x, p.pos.y);
		if (terrain === oxygen) return p;
		if (terrain === wall) return null;
		if (this.map.get(p.pos.x + north.x, p.pos.y + north.y) === undefined) { this.appendPath(p, north); }
		if (this.map.get(p.pos.x + south.x, p.pos.y + south.y) === undefined) { this.appendPath(p, south); }
		if (this.map.get(p.pos.x + west.x, p.pos.y + west.y) === undefined) { this.appendPath(p, west); }
		if (this.map.get(p.pos.x + east.x, p.pos.y + east.y) === undefined) { this.appendPath(p, east); }
		return null;
	}

	explore() {
		for (let i = 0; i < 5; i++) {
			if (this.paths.length === 0) return;
			let res = this.search();
			if (res !== null) {
				this.setState({ path: res });
				this.setPos(res.pos.x, res.pos.y, open);
				this.fillPaths = [{ comp: res.comp, pos: res.pos, path: [] }];
				setTimeout(() => this.fill(), 1);
				return;
			}
		}
		setTimeout(() => this.explore(), 1);
	}

	appendFill(p, dir) {
		let n = { comp: p.comp.copy(), pos: { x: p.pos.x + dir.x, y: p.pos.y + dir.y }, path: [...p.path, dir] };
		let terrain = this.map.get(n.pos.x, n.pos.y);
		if (terrain === oxygen || terrain === wall) return;
		n.comp.stdin.push(dir.c);
		n.comp.run();
		let res = n.comp.stdout.shift();
		this.setPos(n.pos.x, n.pos.y, res);
		if (res !== wall) this.fillPaths.push(n);
	}

	pumpOxy() {
		let p = this.fillPaths.shift();
		let terrain = this.map.get(p.pos.x, p.pos.y);
		if (terrain === open) {
			this.setPos(p.pos.x, p.pos.y, oxygen);
			if (!this.state.fill || this.state.fill.path.length < p.path.length) this.setState({ fill: p });
			this.appendFill(p, north);
			this.appendFill(p, south);
			this.appendFill(p, west);
			this.appendFill(p, east);
		}
	}

	fill() {
		for (let i = 0; i < 5; i++) {
			if (this.fillPaths.length === 0) return;
			this.pumpOxy();
		}
		setTimeout(() => this.fill(), 1);
	}

	solve(input) {
		if (input.length === 0) return;
		this.map = new Map();
		if (this.refs.canvas) {
			const ctx = this.refs.canvas.getContext('2d');
			ctx.clearRect(0, 0, 100 * this.pixel_size, 100 * this.pixel_size);
		}
		this.setPos(0, 0, open);
		this.paths = [{ comp: new Computer().init(input), pos: { x: 0, y: 0 }, path: [] }];
		setTimeout(() => this.explore(), 10);
	}

	customRender() {
		let height = 100;
		let width = 100;
		return <div>
			<p>Shortest path: {this.state.path && this.state.path.path.length}</p>
			<p>Time to fill: {this.state.fill && this.state.fill.path.length} minutes</p>
			{this.map && <canvas id="solution" ref="canvas" width={width * this.pixel_size} height={height * this.pixel_size} />}
		</div>;
	}
}

export class S15b extends Solver {
}