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

	tryMove(path, dir, map, distMap, paths) {
		let n = { x: path.x + dir.x, y: path.y + dir.y, steps: path.steps + 1 };
		let c = map[n.y][n.x];
		if (typeof (c) === "object") {
			let newPos = c.filter(p => p.x !== n.x || p.y !== n.y)[0];
			n.x = newPos.x;
			n.y = newPos.y;
			n.steps -= 1;
			directions.forEach(d => this.tryMove(n, d, map, distMap, paths));
			return;
		}
		if (c === '.' || c === 'Z') {
			let p = distMap[n.y][n.x];
			if (p === 0 || p > n.steps) {
				distMap[n.y][n.x] = n.steps;
				paths.push(n);
			}
		}
	}

	findPath(map, start, stop) {
		let distMap = map.map(l => l.map(() => 0));
		start.steps = 0;
		let paths = [start];
		distMap[start.y][start.x] = 0;
		while (paths.length > 0) {
			let p = paths.shift();
			if (p.x === stop.x && p.y === stop.y) {
				return p.steps - 2;
			}
			directions.forEach(d => {
				this.tryMove(p, d, map, distMap, paths);
			});
			paths.sort((a, b) => a.steps - b.steps);
		}
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split(""));
		let portals = this.findPortals(map);
		this.setState({ map: map, path: this.findPath(map, portals["AA"][0], portals["ZZ"][0]) });
	}

	customRender() {
		let i = 0;
		return <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
			<p>Distance: {this.state.path}</p>
			{this.state.map && this.state.map.map(l => <p key={i++}>{l.map(c => typeof (c) === "object" ? '@' : c).join("")}</p>)}
		</div>;
	}
}

export class S20b extends Solver {
	static hide = true;
}