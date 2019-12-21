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

const colors = [
	{ char: '#', color: [0, 0, 0, 255] },
	{ char: '.', color: [0xcf, 0xcf, 0xcf, 255] },
]

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
		if (!recurse) n.prev = path;
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
				return p;
			}
			directions.forEach(d => {
				this.tryMove(p, d, map, distMap, paths, recurse);
			});
			paths.sort((a, b) => a.steps - b.steps);
		}
	}

	drawMap(map) {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, map[0].length * pixel_size, map.length * pixel_size);
		for (let y = 1; y < map.length - 1; y++) {
			for (let x = 1; x < map[y].length - 1; x++) {
				let c = map[y][x];
				if (c === '#' || c === '.') {
					ctx.fillStyle = "#000000";
					if (c === '.') ctx.fillStyle = "#CFCFCF";
					ctx.fillRect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);
				}
				if (typeof (c) === "object") {
					ctx.fillStyle = "#7F7FCF";
					ctx.beginPath();
					ctx.arc((x + 0.5) * pixel_size, (y + 0.5) * pixel_size, pixel_size / 2, 0, 2 * Math.PI);
					ctx.fill();
				}
				if (c === 'A' || c === 'Z') {
					ctx.fillStyle = "#FF0000";
					if (c === 'Z') ctx.fillStyle = "#00FF00";
					ctx.beginPath();
					if (x === 1) {
						ctx.moveTo(x * pixel_size, y * pixel_size);
						ctx.lineTo((x + 1) * pixel_size, (y + 0.5) * pixel_size);
						ctx.lineTo(x * pixel_size, (y + 1) * pixel_size);
					} else if (x === map[y].length - 2) {
						ctx.moveTo((x + 1) * pixel_size, y * pixel_size);
						ctx.lineTo(x * pixel_size, (y + 0.5) * pixel_size);
						ctx.lineTo((x + 1) * pixel_size, (y + 1) * pixel_size);
					} else if (y === 1) {
						ctx.moveTo(x * pixel_size, y * pixel_size);
						ctx.lineTo((x + 0.5) * pixel_size, (y + 1) * pixel_size);
						ctx.lineTo((x + 1) * pixel_size, y * pixel_size);
					} else if (y === map.length - 2) {
						ctx.moveTo(x * pixel_size, (y + 1) * pixel_size);
						ctx.lineTo((x + 0.5) * pixel_size, y * pixel_size);
						ctx.lineTo((x + 1) * pixel_size, (y + 1) * pixel_size);
					}
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}

	drawSegment(coords) {
		if (coords.length === 1) return;

		let coord = coords.shift();
		let dist = Math.abs(coord.x - coords[0].x) + Math.abs(coord.y - coords[0].y);
		if (dist === pixel_size) {
			const ctx = this.refs.canvas.getContext('2d');
			ctx.strokeStyle = "#FF0000";
			ctx.beginPath();
			ctx.moveTo(coord.x, coord.y);
			ctx.lineTo(coords[0].x, coords[0].y);
			ctx.stroke();
		}
		setTimeout(() => this.drawSegment(coords), 50);
	}

	drawPath(path) {
		let coords = [];
		while (path.prev) {
			coords.unshift(path);
			path = path.prev;
		}
		coords = coords.map(c => { return { x: (c.x + 0.5) * pixel_size, y: (c.y + 0.5) * pixel_size } });
		this.drawSegment(coords);
	}

	solveRecursive(map, portals) {
		this.setState({ recurse: this.findPath(map, portals["AA"][0], portals["ZZ"][0], true).steps - 2 });
	}

	solveNonRecursive(map, portals) {
		this.drawMap(map);
		let path = this.findPath(map, portals["AA"][0], portals["ZZ"][0], false);
		this.setState({ path: path.steps - 2 });
		setTimeout(() => this.drawPath(path), 100);
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
		let map = this.state.map;
		return <div>
			<p>Distance non-recursive: {this.state.path}</p>
			<p>Distance recursive: {this.state.recurse}</p>
			<div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
				{map && <canvas id="solution" ref="canvas" width={map[0].length * pixel_size} height={map.length * pixel_size} />}
				{/*map && map.map(l => <p key={i++}>{l.map(c => typeof (c) === "object" ? '@' : c).join("")}</p>)*/}
			</div>
		</div>;
	}
}

export class S20b extends Solver {
	static hide = true;
}