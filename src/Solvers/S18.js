import React from 'react';
import Solver from './Solver';
import { drawFilledRect } from '../util';

const keys = "abcdefghijklmnopqrstuvwxyz";
const doors = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const north = { x: 0, y: -1 };
const south = { x: 0, y: 1 };
const east = { x: 1, y: 0 };
const west = { x: -1, y: 0 };

class Path {
	constructor(key, dist, from) {
		this.keys = key;
		this.distance = dist;
		if (from) {
			this.keys = from.keys + key;
			this.distance += from.distance;
		}
	}
}

export class S18a extends Solver {
	pixel_size = 7;
	preCalc = {}

	find(map, key) {
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] === key) return { x: x, y: y };
			}
		}
	}

	tryMove(path, from, map, distMap, dists, paths, dir) {
		let to = { x: from.x + dir.x, y: from.y + dir.y };
		let c = map[to.y][to.x];
		if ('#' === c) return; // bumped into wall
		if (doors.includes(c) && !path.keys.includes(c.toLowerCase())) return; // Locked door
		if (keys.includes(c) && !path.keys.includes(c)) {
			paths.push(new Path(c, distMap[from.y][from.x] + 1, path));
			return; // New key found
		}

		let steps = distMap[from.y][from.x] + 1;
		let tgtSteps = distMap[to.y][to.x];
		if (tgtSteps === 0 || steps < tgtSteps) {
			distMap[to.y][to.x] = steps;
			dists.push(to);
		}
	}

	explore(map, paths, best) {
		for (let i = 1000; i > 0; i--) {
			if (paths.length < 1) {
				if (best) {
					this.setState({ done: true, paths: [best] });
					return;
				}
				throw new Error("Search failed");
			}
			let p = paths.shift();
			if (p.keys.length === this.keyCount) {
				if (best === undefined || p.distance < best.distance) {
					best = p;
					console.log(`New best: ${best.distance}`);
				}
				continue;
			}
			let dists = [this.find(map, p.keys[p.keys.length - 1])];
			let distMap = map.map(l => l.map(c => 0));
			while (dists.length > 0) {
				let f = dists.shift();
				this.tryMove(p, f, map, distMap, dists, paths, north);
				this.tryMove(p, f, map, distMap, dists, paths, south);
				this.tryMove(p, f, map, distMap, dists, paths, east);
				this.tryMove(p, f, map, distMap, dists, paths, west);
			}
			paths.sort((a, b) => b.keys.length === a.keys.length ? a.distance - b.distance : b.keys.length - a.keys.length);
		}
		if (best)
			this.setState({ paths: [best] });
		// setTimeout(() => this.explore(map, paths, best), 0);
	}

	inventory(pos, dists, distMap, map, quad, dir) {
		let to = { x: pos.x + dir.x, y: pos.y + dir.y };
		let c = map[to.y][to.x];
		if ('#' === c) return; // bumped into wall
		let steps = distMap[pos.y][pos.x] + 1;
		if (keys.includes(c)) {
			if (!quad.keys.includes(c)) quad.keys += c;
			if (quad[c] === undefined || quad[c] > steps) quad[c] = steps;
		}

		let tgtSteps = distMap[to.y][to.x];
		if (tgtSteps === 0 || steps < tgtSteps) {
			distMap[to.y][to.x] = steps;
			dists.push(to);
		}
	}

	inventoryKeys(map, x, y) {
		let quad = { doors: "", keys: "" };
		let dists = [{ x: x, y: y }];
		let distMap = map.map(l => l.map(c => 0));
		while (dists.length > 0) {
			let p = dists.shift();
			this.inventory(p, dists, distMap, map, quad, north);
			this.inventory(p, dists, distMap, map, quad, south);
			this.inventory(p, dists, distMap, map, quad, east);
			this.inventory(p, dists, distMap, map, quad, west);
		}
		return quad;
	}

	keyPath(key, path, paths, distMap, map, quad, dir) {
		let to = { ...path, x: path.x + dir.x, y: path.y + dir.y, steps: path.steps + 1 };
		let c = map[to.y][to.x];
		if ('#' === c) return; // bumped into wall
		if (key === c) {
			console.log(`Found path: ${to.steps}`);
			quad.paths.push(to);
		}

		if (keys.includes(c) && !to.keys.includes(c)) { to.keys += c; }
		if (doors.includes(c) && !to.doors.includes(c)) { to.doors += c; }

		let tgtSteps = distMap[to.y][to.x];
		if (tgtSteps === 0 || to.steps < tgtSteps) {
			distMap[to.y][to.x] = to.steps;
			paths.push(to);
		}
	}

	findPath(map, x, y, key, quad) {
		let paths = [{ x: x, y: y, steps: 0, keys: "", doors: "" }];
		quad.paths = [];
		let distMap = map.map(l => l.map(c => 0));
		while (paths.length > 0) {
			let p = paths.shift();
			this.keyPath(key, p, paths, distMap, map, quad, north);
			this.keyPath(key, p, paths, distMap, map, quad, south);
			this.keyPath(key, p, paths, distMap, map, quad, east);
			this.keyPath(key, p, paths, distMap, map, quad, west);
		}
	}

	calcDoors(map, x, y, quad) {
		let key = '';
		let max = 0;
		for (let i = 0; i < quad.keys.length; i++) {
			let k = quad.keys[i];
			if (quad[k] > max) {
				key = k;
				max = quad[k];
			}
		}
		this.findPath(map, x, y, key, quad);
	}

	scanQuadrant(map, x, y) {
		let quad = this.inventoryKeys(map, x, y);
		this.calcDoors(map, x, y, quad);
		return quad;
	}

	calculatePath(map) {
		let start = this.find(map, '@');
		let scanMap = map.map(l => l.slice());
		scanMap[start.y + 1][start.x] = '#';
		scanMap[start.y - 1][start.x] = '#';
		scanMap[start.y][start.x + 1] = '#';
		scanMap[start.y][start.x - 1] = '#';
		let quad = [];
		quad.push(this.scanQuadrant(scanMap, start.x - 1, start.y - 1));
		quad.push(this.scanQuadrant(scanMap, start.x + 1, start.y - 1));
		quad.push(this.scanQuadrant(scanMap, start.x - 1, start.y + 1));
		quad.push(this.scanQuadrant(scanMap, start.x + 1, start.y + 1));
		console.log(quad);
	}

	color(c) {
		if (c === '#') return "#000000";
		if (doors.includes(c)) return "#fF3F3F";
		if (keys.includes(c)) return "#FFFF7F";
		return "#CFCFCF";
	}

	drawMap(map) {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, map[0].length * this.pixel_size, map.length * this.pixel_size);
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				drawFilledRect(ctx, x * this.pixel_size, y * this.pixel_size, (x + 1) * this.pixel_size, (y + 1) * this.pixel_size, this.color(map[y][x]));
			}
		}
	}

	solve(input) {
		this.keyCount = 1;
		for (let i = 0; i < input.length; i++) { if (keys.includes(input[i])) this.keyCount++; }
		let map = input.split("\n").map(l => l.split("")).map(l => l.map(c => c === '.' ? ' ' : c));
		this.calculatePath(map);
		this.setState({ map: map });
		setTimeout(() => this.drawMap(map), 10);
	}

	customRender() {
		let i = 0;
		return <div>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: this.state.map ? `${this.state.map[0].length * this.pixel_size}px` : "" }}>
				<div>Shortest: {this.state.paths && this.state.paths[0].distance}</div>
				<div style={{ width: "17em" }}>Path: {this.state.paths && this.state.paths[0].keys}</div>
			</div>
			{this.state.map && <canvas id="solution" ref="canvas" width={this.state.map[0].length * this.pixel_size} height={this.state.map.length * this.pixel_size} />}
			{this.state.map && <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>{this.state.map.map(l => <p key={i++}>{l.join("")}</p>)}</div>}
			{this.state.done && <p>Done!</p>}
		</div>;
	}
}

export class S18b extends Solver {
	static hide = true;
}
