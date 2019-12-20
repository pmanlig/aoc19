import React from 'react';
import Solver from './Solver';

function isLetter(c) { return c >= 'A' && c <= 'Z'; }
function validCoordinate(map, x, y) { return y >= 0 && y < map.length && x >= 0 && x < map[y].length; }

const portalCoords = [
	{ idX: 0, idY: 1, eX: 0, eY: -1, pX: 0, pY: 0 },
	{ idX: 0, idY: 1, eX: 0, eY: 2, pX: 0, pY: 1 },
	{ idX: 1, idY: 0, eX: -1, eY: 0, pX: 0, pY: 0 },
	{ idX: 1, idY: 0, eX: 2, eY: 0, pX: 1, pY: 0 }
];

const north = { x: 0, y: -1 };
const south = { x: 0, y: 1 };
const east = { x: 1, y: 0 };
const west = { x: -1, y: 0 };
const directions = [north, south, east, west];
const pixel_size = 5;

export class S20a extends Solver {
	findPortals(map) {
		let portals = {};
		for (let y = 0; y < map.length - 1; y++) {
			for (let x = 0; x < map[0].length - 1; x++) {
				let c = map[y][x];
				if (isLetter(c)) {
					portalCoords.forEach(p => {
						let idX = x + p.idX;
						let idY = y + p.idY;
						let eX = x + p.eX;
						let eY = y + p.eY;
						if (validCoordinate(map, idX, idY) && validCoordinate(map, eX, eY) &&
							isLetter(map[idY][idX]) && '.' === map[eY][eX]) {
							let id = c + map[idY][idX];
							if (portals[id] === undefined) portals[id] = [];
							portals[id].push({ x: x + p.pX, y: y + p.pY });
						}
					});
				}
			}
		}
		for (let p in portals) {
			if (Object.prototype.hasOwnProperty.call(portals, p)) {
				if (portals[p].length === 2)
					portals[p].forEach(coord => {
						map[coord.y][coord.x] = portals[p];
					});
			}
		}
		return portals;
	}

	tryMove(path, dir, map, distMap, paths, recurse) {
		let n = { x: path.x + dir.x, y: path.y + dir.y, steps: path.steps + 1, lvl: path.lvl };
		let c = map[n.y][n.x];
		if (typeof (c) === "object") {
			if (recurse) {
				if (n.x === 1 || n.y === 1 || n.x === map[n.y].length - 2 || n.y === map.length - 2) {
					n.lvl--;
					if (n.lvl < 0) return; // No portal from lvl 0
				} else {
					n.lvl++;
					if (distMap[n.lvl] === undefined) distMap[n.lvl] = map.map(l => l.map(() => 0));
				}
			}
			let newPos = c.filter(p => p.x !== n.x || p.y !== n.y)[0];
			n.x = newPos.x;
			n.y = newPos.y;
			n.steps -= 1;
			directions.forEach(d => this.tryMove(n, d, map, distMap, paths));
			return;
		}
		if (c === '.' || (c === 'Z' && n.lvl === 0)) {
			let p = distMap[n.lvl][n.y][n.x];
			if (p === 0 || p > n.steps) {
				distMap[n.lvl][n.y][n.x] = n.steps;
				paths.push(n);
			}
		}
	}

	findPath(map, start, stop, recurse) {
		let distMap = [];
		distMap[0] = map.map(l => l.map(() => 0));
		start.steps = 0;
		start.lvl = 0;
		let paths = [start];
		distMap[start.lvl][start.y][start.x] = 0;
		while (paths.length > 0) {
			let p = paths.shift();
			if (p.x === stop.x && p.y === stop.y) {
				return p.steps - 2;
			}
			directions.forEach(d => {
				this.tryMove(p, d, map, distMap, paths, recurse);
			});
			paths.sort((a, b) => a.steps - b.steps);
		}
	}

	solveRecursive(map, portals) {
		this.setState({ recurse: this.findPath(map, portals["AA"][0], portals["ZZ"][0], true) });
	}

	solveNonRecursive(map, portals) {
		this.setState({ path: this.findPath(map, portals["AA"][0], portals["ZZ"][0], false) });
		setTimeout(() => this.solveRecursive(map, portals), 10);
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split(""));
		let portals = this.findPortals(map);
		this.setState({ map: map });
		setTimeout(() => this.solveNonRecursive(map, portals), 10);
	}

	customRender() {
		let i = 0;
		return <div>
			<p>Distance non-recursive: {this.state.path}</p>
			<p>Distance recursive: {this.state.recurse}</p>
			<div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
				{this.state.map && this.state.map.map(l => <p key={i++}>{l.map(c => typeof (c) === "object" ? '@' : c).join("")}</p>)}
			</div>
		</div>;
	}
}

export class S20b extends Solver {
	static hide = true;
}