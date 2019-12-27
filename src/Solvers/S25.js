import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

const room_size = 25;
const map_width = 800;
const map_height = 450;

function putCmd(comp, cmd) {
	for (let i = 0; i < cmd.length; i++) {
		comp.stdin.push(cmd.charCodeAt(i));
	}
}

export class S25a extends Solver {
	rooms = [];
	pos = { x: 0, y: 0 }
	state = { cmd: "" }
	warp = [
		{ dir: 'south', x: 0, y: 1, dx: 0, dy: 3 },
		{ dir: 'north', x: 0, y: 3, dx: 0, dy: -3 },
		{ dir: 'east', x: 1, y: 0, dx: 3, dy: 0 },
		{ dir: 'west', x: 3, y: 0, dx: -3, dy: 0 },
		{ dir: 'south', x: 4, y: 1, dx: 0, dy: 6 },
		{ dir: 'north', x: 4, y: 6, dx: 0, dy: -6 },
		{ dir: 'east', x: -5, y: 7, dx: 9, dy: 0 },
		{ dir: 'west', x: 3, y: 7, dx: -9, dy: 0 },
	]

	items = ["pointer", "coin", "mug", "manifold", "hypercube", "easter egg", "astrolabe", "candy cane"];

	autoCmd = "west\ntake mug\nnorth\ntake easter egg\nsouth\neast\nsouth\neast\nnorth\ntake candy cane\n" +
		"south\nwest\nnorth\neast\ntake coin\nnorth\nnorth\ntake hypercube\nsouth\neast\ntake manifold\nwest\n" +
		"south\nsouth\neast\ntake pointer\nwest\nwest\ntake astrolabe\nnorth\neast\nnorth\ndrop pointer\n" +
		"drop coin\ndrop mug\ndrop manifold\ndrop hypercube\ndrop easter egg\ndrop astrolabe\ndrop candy cane";

	enterInput(cmd) {
		if (cmd.length > 0) {
			putCmd(this.comp, cmd + "\n");
		}
		let r = this.rooms.find(r => r.x === this.pos.x && r.y === this.pos.y);
		if (cmd === 'north' && r.dir.includes("N")) { this.pos.y--; }
		if (cmd === 'south' && r.dir.includes("S")) { this.pos.y++; }
		if (cmd === 'east' && r.dir.includes("E")) { this.pos.x++; }
		if (cmd === 'west' && r.dir.includes("W")) { this.pos.x--; }

		this.warp.forEach(w => {
			if (cmd === w.dir && this.pos.x === w.x && this.pos.y === w.y) { this.pos.x += w.dx; this.pos.y += w.dy; }
		});
	}

	translateX(x) {
		return (x + 16) * room_size;
	}

	translateY(y) {
		return (y + 5) * room_size;
	}

	updateMap() {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, map_width, map_height);
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#CF7F00";
		this.rooms.forEach(r => {
			let x = this.translateX(r.x);
			let y = this.translateY(r.y);
			ctx.beginPath();
			ctx.rect(x, y, room_size, room_size);
			ctx.stroke();
			if (r.dir.includes("N")) { ctx.fillRect(x + 5, y - 2, 15, 5); }
			if (r.dir.includes("S")) { ctx.fillRect(x + 5, y + room_size - 2, 15, 5); }
			if (r.dir.includes("E")) { ctx.fillRect(x + room_size - 2, y + 5, 5, 15); }
			if (r.dir.includes("W")) { ctx.fillRect(x - 2, y + 5, 5, 15); }
		});
		ctx.strokeStyle = "#00CF00";
		let x = this.translateX(this.pos.x) + 5;
		let y = this.translateY(this.pos.y) + 5;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + 15, y + 15);
		ctx.stroke();
		ctx.moveTo(x + 15, y);
		ctx.lineTo(x, y + 15);
		ctx.stroke();
	}

	parseOutput() {
		let output = "";
		while (this.comp.stdout.length > 0) {
			output += String.fromCharCode(this.comp.stdout.shift());
		}
		if (!this.rooms.some(r => r.x === this.pos.x && r.y === this.pos.y)) {
			let dir = "";
			if (output.includes("- north\n")) { dir += "N" }
			if (output.includes("- south\n")) { dir += "S" }
			if (output.includes("- east\n")) { dir += "E" }
			if (output.includes("- west\n")) { dir += "W" }
			this.rooms.push({ ...this.pos, dir: dir });
		}
		this.updateMap();
		return output;
	}

	runCommand(cmd) {
		this.enterInput(cmd);
		this.comp.run();
		this.setState({ cmd: "", output: this.parseOutput() });
	}

	tryCombinations() {
		for (let i = 1; i < 256; i++) {
			let comp = this.comp.copy();
			while (comp.stdout.length > 0) { comp.stdout.shift(); }
			let p = i, n = 0;
			while (p > 0) {
				if (p % 2 === 1) { putCmd(comp, `take ${this.items[n]}\n`) }
				n++;
				p = Math.floor(p / 2);
			}
			comp.run();
			while (comp.stdout.length > 0) { comp.stdout.shift(); }
			putCmd(comp, "east\n");
			comp.run();
			let msg = ``;
			while (comp.stdout.length > 0) { msg += String.fromCharCode(comp.stdout.shift()); }
			if (!msg.includes("ejected back to the checkpoint")) {
				this.setState({ output: msg });
			}
		}
	}

	autoCommands(auto) {
		if (auto.length === 0) {
			this.tryCombinations();
			return;
		}
		this.runCommand(auto.shift());
		setTimeout(() => this.autoCommands(auto), 100);
	}

	solve(input) {
		this.program = input;
		this.comp = new Computer().init(input);
		this.runCommand("");
		setTimeout(() => this.autoCommands(this.autoCmd.split("\n")), 100);
	}

	handleKey(e) {
		if (e.key === 'Enter') {
			this.runCommand(this.state.cmd);
			e.preventDefault();
		}
	}

	customRender() {
		return <div>
			<canvas id="solution" ref="canvas" width={map_width} height={map_height} />
			{this.state.output && this.state.output.split("\n").map((l, i) => <p key={i}>{l}</p>)}
			<p><input value={this.state.cmd} onChange={e => this.setState({ cmd: e.target.value })} onKeyPress={e => this.handleKey(e)} /></p>
		</div>;
	}
}

export class S25b extends Solver {
}