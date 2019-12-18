import React from 'react';
import Solver from './Solver';

const keys = "abcdefghijklmnopqrstuvwxyz";
const doors = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const north = { x: 0, y: -1 };
const south = { x: 0, y: 1 };
const east = { x: 1, y: 0 };
const west = { x: -1, y: 0 };

class Path {
	constructor(keys, x, y, path) {
		this.keys = keys;
		this.x = x;
		this.y = y;
		this.path = path;
	}

	extend(direction) {
		return new Path(this.keys, this.x + direction.x, this.y + direction.y, this.path.slice());
	}
}

export class S18a extends Solver {

	findStart(map) {
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] === '@') return { x: x, y: y };
			}
		}
	}

	tryMove(head, map, paths, direction) {
		let x = head.x + direction.x;
		let y = head.y + direction.y;
		if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) return; // Went off map
		if (head.path.filter(p => p.x === x && p.y === y).length > 0) return; // Don't double back
		let c = map[y][x];
		if (c === "#") return; // Bumped into wall
		if (doors.includes(c) && !head.keys.includes(c.toLowerCase())) return; // Door that cannot be opened

		let n = new Path(head.keys, x, y, head.path.slice().concat([{ x: x, y: y }]));
		if (keys.includes(c) && !n.keys.includes(c)) n.keys += c;
		map[y][x] = ".";
		paths.push(n); // Step OK
	}

	explore(map, paths) {
		if (paths.length < 1) return; // Error - unsolvable
		if (paths[0].keys.length === 1) {
			// paths[0].path.forEach(p => map[p.y][p.x] = '.');
			this.setState({ shortest: paths[0], map: map });
			console.log(paths[0]);
			return;
		}
		let head = paths.shift();
		this.tryMove(head, map, paths, north);
		this.tryMove(head, map, paths, south);
		this.tryMove(head, map, paths, east);
		this.tryMove(head, map, paths, west);
		paths.sort((a, b) => a.path.length - b.path.length);
		setTimeout(() => this.explore(map, paths), 0);
	}

	calculatePath(map) {
		let start = this.findStart(map);
		let paths = [new Path("", start.x, start.y, [start])];
		this.explore(map, paths);
	}

	solve(input) {
		let cnt = 0;
		for (let i = 0; i < input.length; i++) { if (keys.includes(input[i])) cnt++; }
		console.log(cnt);
		let map = input.split("\n").map(l => l.split("")).map(l => l.map(c => c === '.' ? ' ' : c));
		this.calculatePath(map);
		this.setState({ map: map });
	}

	customRender() {
		let i = 0;
		return <div>
			<p>Shortest: {this.state.shortest && this.state.shortest.path.length}</p>
			{this.state.map && this.state.map.map(l => <p key={i++} style={{ fontFamily: "monospace", whiteSpace: "pre" }}>{l.join("")}</p>)}
		</div>;
	}
}

export class S18b extends Solver {
	runControls = true;

	solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}