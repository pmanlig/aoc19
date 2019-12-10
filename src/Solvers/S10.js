import React from 'react';
import Solver from './Solver';

export class S10a extends Solver {
	visible(map, x1, y1, x2, y2) {
		let dy = y2 - y1, dx = x2 - x1;
		let d = Math.abs(dy);
		if (d === 0 || (dx !== 0 && Math.abs(dx) < d)) d = Math.abs(dx);
		while (d > 1) {
			if (dy % d === 0 && dx % d === 0) {
				let sy = dy / d, sx = dx / d;
				let y3 = y2 - sy, x3 = x2 - sx;
				while (y3 !== y1 || x3 !== x1) {
					if (map[y3][x3] !== 0) { return false; }
					y3 -= sy;
					x3 -= sx;
				}
				break;
			}
			d--;
		}
		return true;
	}

	calcVisible(map, x, y) {
		let lc = 0;
		for (let y2 = 0; y2 < map.length; y2++) {
			for (let x2 = 0; x2 < map[y2].length; x2++) {
				if (map[y2][x2] !== 0 && (y2 !== y || x2 !== x) && this.visible(map, x, y, x2, y2)) { lc++; }
			}
		}
		return lc;
	}

	calcAllVisible(map) {
		let result = {
			max: 0,
			count: 0,
			x: -1,
			y: -1
		};
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] !== 0) {
					result.count++;
					map[y][x] = this.calcVisible(map, x, y);
					if (map[y][x] > result.max) {
						result.max = map[y][x];
						result.x = x;
						result.y = y;
					}
				}
			}
		}
		return result;
	}

	bearing(x1, y1, x2, y2) {
		let dx = x2 - x1, dy = y2 - y1;
		let length = Math.sqrt(dx * dx + dy * dy);
		let b = 0;
		if (dy !== 0) {
			b = (Math.PI / 2) - Math.asin(-dy / length);
			if (dx < 0) b = -b;
		} else {
			b = (Math.PI / 2) - Math.acos(dx / length);
		}
		while (b < 0) { b += 2 * Math.PI }
		return b;
	}

	calcOrder(map, x, y) {
		let result = [];
		for (let y2 = 0; y2 < map.length; y2++) {
			for (let x2 = 0; x2 < map[y].length; x2++) {
				if (map[y2][x2] !== 0 && (y2 !== y || x2 !== x) && this.visible(map, x, y, x2, y2)) {
					result.push({ x: x2, y: y2, bearing: this.bearing(x, y, x2, y2) });
				}
			}
		}
		return result;
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split("").map(c => c === "#" ? 1 : 0));
		let result = this.calcAllVisible(map);
		result.destroyOrder = this.calcOrder(map, result.x, result.y).sort((a, b) => a.bearing - b.bearing);
		this.setState({
			map: map,
			result: result,
		});
	}

	customRender() {
		let map = this.state.map;
		let result = this.state.result;
		let i = 1;
		return <div>
			{map && <p>Map: {`${map.length}x${map[0].length}`}</p>}
			{result && <p>Asteroids: {`${result.count}`}</p>}
			{result && <p>Max: {`${result.max}`}</p>}
			{result && <p>Max @ [{`${result.x}, ${result.y}`}]</p>}
			{result && <p>200th lasered: {`${result.destroyOrder[199].x * 100 + result.destroyOrder[199].y}`}</p>}
			{result && <table style={{ borderSpacing: "10px 0" }}>
				<thead><tr><th>#</th><th>Key</th><th>(X, Y)</th><th>Bearing</th></tr></thead>
				<tbody>
					{result.destroyOrder.map(c => <tr key={c.x * 100 + c.y}><td>{i++}</td><td>{c.x * 100 + c.y}</td><td>({c.x}, {c.y})</td><td>{c.bearing}</td></tr>)}
				</tbody>
			</table>
			}
		</div>;
	}
}

export class S10b extends Solver {
	static hide = true;
}