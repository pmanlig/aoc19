import '../util/Blink.css';
import React from 'react';
import Solver from './Solver';
import { drawCircle, drawFilledCircle, drawLine } from '../util';

export class S10a extends Solver {
	scaling = 15;
	state = { phase: 0 };

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

	convert(coord) {
		return (coord + 0.5) * this.scaling;
	}

	drawAsteroids(ctx) {
		let map = this.state.map;
		if (!map) return;
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x]) {
					drawCircle(ctx, this.convert(x), this.convert(y), 3, "#000000");
				}
			}
		}
	}

	drawBase(ctx) {
		let { result } = this.state;
		if (!result) return;
		drawFilledCircle(ctx, this.convert(result.x), this.convert(result.y), 3, "#0000FF");
	}

	shoot(ctx) {
		let { result } = this.state;
		let { destroyOrder } = result;
		let to = destroyOrder[0];
		console.log(result);
		console.log(to);
		drawLine(ctx, this.convert(result.x), this.convert(result.y), this.convert(to.x), this.convert(to.y), "#FF0000", 1);
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split("").map(c => c === "#" ? 1 : 0));
		let result = this.calcAllVisible(map);
		result.destroyOrder = this.calcOrder(map, result.x, result.y).sort((a, b) => a.bearing - b.bearing);
		result.target = result.destroyOrder[199];
		setTimeout(() => this.updatePhase(), 3000);
		this.setState({
			map: map,
			count: result.count,
			result: result,
			phase: 0,
			text: "Scanning asteroids",
			blink: true
		});
	}

	updatePhase() {
		let { map, phase, destroyed, result, count } = this.state;
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, map[0].length * this.scaling, map.length * this.scaling);
		if (phase > 0) this.drawBase(ctx);
		this.drawAsteroids(ctx);
		switch (phase) {
			case 0:
				this.setState({ phase: 1, text: "Asteroids mapped - deploying base", blink: false });
				setTimeout(() => this.updatePhase(), 1000)
				break;
			case 1:
				this.setState({ phase: 2, text: "Base deployed - calculating fire solution", blink: true });
				setTimeout(() => this.updatePhase(), 1000)
				break;
			case 2:
				if (!destroyed) destroyed = [];
				this.shoot(ctx);
				let tgt = result.destroyOrder.shift();
				map[tgt.y][tgt.x] = 0;
				destroyed.push(tgt);
				this.setState({ phase: destroyed.length < 200 ? 2 : 3, count: count - 1, text: "Firing!!!", blink: true, firing: true, destroyed: destroyed });
				setTimeout(() => this.updatePhase(), 20);
				break;
			case 3:
				this.setState({ phase: 3, text: "200 targets neutralized, sir!", blink: false, firing: false, destroyed: destroyed });
				break;
			default:
				break;
		}
	}

	customRender() {
		let { map, result, blink, firing, count } = this.state;
		let i = 1;
		return <div>
			{map && <p>Map: {`${map.length}x${map[0].length}`}</p>}
			{result && <p>Asteroids: {`${count}`}</p>}
			{result && <p>Max: {`${result.max}`}</p>}
			{result && <p>Max @ [{`${result.x}, ${result.y}`}]</p>}
			{result && <p>200th lasered: {`${result.target.x * 100 + result.target.y}`}</p>}
			{result && <div>
				<canvas id="solution" ref="canvas" width={map[0].length * this.scaling} height={map.length * this.scaling} style={{ margin: "10px" }} />
				<p className={blink ? "blink" : undefined} style={{ fontWeight: firing ? "bold" : undefined, color: firing ? "red" : "black" }}>{this.state.text}</p>
			</div>}

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