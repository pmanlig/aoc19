import React from 'react';
import Solver from './Solver';
import { CssImage } from '../util';
import { Computer } from './IntCode';

class Robot {
	static up = 0;
	static down = 1;
	static left = 2;
	static right = 3;

	step = [
		{ x: 0, y: -1 },
		{ x: 0, y: 1 },
		{ x: -1, y: 0 },
		{ x: 1, y: 0 }
	];

	turn = [
		[Robot.left, Robot.right, Robot.down, Robot.up],
		[Robot.right, Robot.left, Robot.up, Robot.down]
	];

	facing = Robot.up;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	move(direction) {
		this.facing = this.turn[direction][this.facing];
		this.x += this.step[this.facing].x;
		this.y += this.step[this.facing].y;
	}
}

class Hull {
	surface = [];

	validate(x, y) {
		if (x < 0 || y < 0) throw new Error(`Out of bounds: <${x}, ${y}>`);
		if (this.surface[y] === undefined) this.surface[y] = [];
	}

	get(x, y) {
		this.validate(x, y);
		return this.surface[y][x];
	}

	set(x, y, value) {
		this.validate(x, y);
		this.surface[y][x] = value;
	}

	display(start) {
		let ri = 0, ci = 0;
		let rows = this.surface.filter(r => r !== undefined);
		let maxcol = Math.max(...rows.map(r => r.length));
		rows.forEach(r => {
			for (let i = 0; i < maxcol; i++) { r[i] = r[i] === 1 ? 1 : 0 }
		});
		return <div className="hull-grid">
			{rows.map(r => <div className="hull-row" key={ri++}>{r.map(c => <div className={c === 1 ? "hull-white" : "hull-black"} key={ci++}></div>)}</div>)}
		</div>;
	}
}

export class S11a extends Solver {
	solve(input) {
		let hull = new Hull();
		let stdin = [0];
		let stdout = [];
		let c = new Computer().init(input, stdin, stdout);
		let rob = new Robot(100, 100);
		while (c.run() === 1) {
			hull.set(rob.x, rob.y, stdout.shift());
			rob.move(stdout.shift());
			stdin.push(hull.get(rob.x, rob.y) === 1 ? 1 : 0);
		}
		this.setState({ hull: hull });
	}

	customRender() {
		return <div>
			{this.state.hull && <p>Panel count: {this.state.hull.surface.reduce((t, n) => t.concat(n)).filter(e => e !== undefined).length}</p>}
			{this.state.error && <p>Error: {this.state.error.message}</p>}
		</div>;
	}
}

export class S11b extends Solver {
	solve(input) {
		let hull = new Hull();
		hull.set(0, 0, 1);
		let c = new Computer().init(input, [1]);
		let rob = new Robot(0, 0);
		while (c.run() === 1) {
			hull.set(rob.x, rob.y, c.stdout.shift());
			rob.move(c.stdout.shift());
			c.stdin.push(hull.get(rob.x, rob.y) === 1 ? 1 : 0);
		}
		this.setState({ hull: hull });
	}

	customRender() {
		return <div>
			{this.state.hull && <CssImage value={this.state.hull.surface} colors={["black", "white"]} />}
			{this.state.hull && <p>Panel count: {this.state.hull.surface.reduce((t, n) => t.concat(n)).filter(e => e !== undefined).length}</p>}
			{this.state.error && <p>Error: {this.state.error.message}</p>}
		</div>;
	}
}