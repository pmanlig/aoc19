// import React from 'react';
import Solver from './Solver';

export class S10a extends Solver {
	solve(input) {
		let log = [];
		try {
			let map = input.split("\n").map(l => l.split("").map(c => c === "#" ? 1 : 0));
			let count = 0;
			let max = 0;
			for (let y = 0; y < map.length; y++) {
				for (let x = 0; x < map[y].length; x++) {
					if (map[y][x] !== 0) {
						count++;
						let lc = 0;
						for (let y2 = 0; y2 < map.length; y2++) {
							for (let x2 = 0; x2 < map[y2].length; x2++) {
								if (map[y2][x2] !== 0 && (y2 !== y || x2 !== x)) {
									let visible = 1;
									let dy = y2 - y, dx = x2 - x;
									let debug = x === 0 && y === 2 && x2 === 4 && y2 === 2;
									if (debug) { log.push("Debugging"); }
									let d = Math.abs(dy);
									if (d === 0 || Math.abs(dx) < d) d = Math.abs(dx);
									while (d > 1) {
										if (dy % d === 0 && dx % d === 0) {
											if (debug) { log.push(`d = ${d}`) }
											let sy = dy / d;
											let sx = dx / d;
											let y3 = y2 - sy, x3 = x2 - sy;
											if (debug) { log.push(`sy = ${sy}, sx = ${sx}`); }
											if (debug) { log.push(`Testing [${x3},${y3}] - ${map[y3][x3]}`) }
											while (y3 !== y || x3 !== x) {
												if (debug) { log.push(`Testing [${x3},${y3}] - ${map[y3][x3]}`) }
												if (map[y3][x3] !== 0) {
													visible = 0;
												}
												y3 -= sy;
												x3 -= sx;
											}
											break;
										}
										d--;
									}
									if (debug) { console.log(`Visible: ${visible}`); }
									lc += visible;
								}
							}
						}
						map[y][x] = lc;
						if (lc > max) { max = lc; }
					}
				}
			}
			this.setState({ solution: `Map: ${map.length}x${map[0].length}\nAsteroids: ${count}\nMax: ${max}\n[0,2] = ${map[2][0]}` });
		} catch (e) {
			console.log(e);
			console.log(log);
		}
	}
}

export class S10b extends Solver {
	runControls = true;

	solve(input) {
		if (this.running)
			this.setState({ solution: input });
	}
}