import './S13.css';
import '../util/CssImage.css';
import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';
import { drawCircle, drawFilledCircle, drawLine, drawFilledRect } from '../util';

export class S13a extends Solver {
	pixel_size = 25;
	stdin = [];
	stdout = [];
	screen = [];
	score = 0;
	nextInput = 0;
	cheat = false;
	colors = [];
	colorList = [
		"#CFFFCF",
		"#00FF00",
		"#00CF00",
		"#7F7FFF",
		"#3F3FFF",
		"#00007F",
		"#FF7F7F",
		"#FF3F3F",
		"#7F0000",
		"#3F3FFF",
		"#CFCF00",
		"#00CFCF",
		"#CFCFCF",
		"#CFFFCF",
		"#00FF00",
		"#00CF00",
		"#7F7FFF",
		"#3F3FFF",
		"#00007F",
		"#FF7F7F",
		"#FF3F3F",
		"#7F0000",
		"#3F3FFF",
		"#CFCF00",
		"#00CFCF",
		"#CFCFCF",
	];
	map = ["", "#", "U", "=", "o"];
	styles = [
		"empty",
		"wall",
		"block",
		"paddle",
		"ball"
	]

	constructor(props) {
		super(props);
		document.addEventListener('keydown', e => {
			if (e.keyCode === 37) this.nextInput = -1;
			if (e.keyCode === 39) this.nextInput = 1;
		});
		document.addEventListener('keyup', e => {
			if (e.keyCode === 37 || e.keyCode === 39) this.nextInput = 0;
		});
	}

	updateScreen() {
		let output = this.stdout;
		let screen = this.screen;
		let score = 0;
		let count = 0;
		while (output.length > 0) {
			let x = output.shift();
			let y = output.shift();
			let t = output.shift();
			if (x === -1) {
				score = t;
			} else {
				if (screen[y] === undefined) screen[y] = [];
				if (t === 2) count++;
				if (t === 3) this.paddle = x;
				if (t === 4) this.ball = x;
				screen[y][x] = t;
			}
		}
		return { score: score, blocks: count };
	}

	drawWalls() {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(0.5 * this.pixel_size, (this.screen.length - 0.5) * this.pixel_size);
		ctx.lineTo(0.5 * this.pixel_size, 0.5 * this.pixel_size);
		ctx.lineTo((this.screen[0].length - 0.5) * this.pixel_size, 0.5 * this.pixel_size);
		ctx.lineTo((this.screen[0].length - 0.5) * this.pixel_size, (this.screen.length - 0.5) * this.pixel_size);
		ctx.stroke();
	}

	transform(x) {
		return Math.floor((x + 0.5) * this.pixel_size);
	}

	drawGame() {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(this.pixel_size, this.pixel_size, (this.screen[0].length - 2) * this.pixel_size, (this.screen.length - 1) * this.pixel_size);
		for (let y = 1; y < this.screen.length; y++) {
			for (let x = 1; x < this.screen[0].length - 1; x++) {
				switch (this.screen[y][x]) {
					case 2:
						if (!this.colors[y]) { this.colors[y] = this.colorList.shift(); }
						drawFilledRect(ctx, this.transform(x - 0.4), this.transform(y - 0.2), this.transform(x + 0.4), this.transform(y + 0.2), this.colors[y]);
						break;
					case 3:
						drawLine(ctx, this.transform(x - 0.5), this.transform(y), this.transform(x + 0.5), this.transform(y), "#0000FF", 3);
						break;
					case 4:
						drawFilledCircle(ctx, this.transform(x), this.transform(y), 3, "#CFCF00");
						drawCircle(ctx, this.transform(x), this.transform(y), 3, "#000000", 1);
						break;
					default:
						break;
				}
			}
		}
	}

	solve(input) {
		this.computer = new Computer(input, this.stdin, this.stdout);
		let res = this.computer.run();
		let { blocks } = this.updateScreen();
		setTimeout(() => this.drawWalls(), 10);
		setTimeout(() => this.drawGame(), 10);
		this.setState({
			program: input,
			tiles: blocks,
			current: blocks,
			result: res
		});
	}

	play(cheat) {
		this.stdin = [];
		this.stdout = [];
		this.score = 0;
		this.cheat = cheat;
		this.computer = new Computer(this.state.program, this.stdin, this.stdout);
		this.computer.mem[0] = 2;
		this.move();
	}

	input() {
		if (this.stdin.length === 0 && this.cheat) {
			this.nextInput = 0;
			if (this.ball > this.paddle) this.nextInput = 1;
			if (this.ball < this.paddle) this.nextInput = -1;
		}
		this.stdin.push(this.nextInput);
		this.move();
	}

	move() {
		let result = this.computer.run();
		let { score, blocks } = this.updateScreen();
		this.drawGame();
		if (score !== 0) this.score = score;
		this.setState({
			current: blocks,
			result: result
		});
		if (result === 1)
			setTimeout(() => this.input(), this.cheat ? 10 : 1000);
	}

	renderImage() {
		let i = 0;
		return <div className="css-image">
			{this.screen.map(r => <div className="css-image-row" key={i++}>
				{r.map(c => <div className={`css-image-pixel ${this.styles[c]}`} key={i++}>{this.map[c]}</div>)}
			</div>)}
		</div>;
	}

	customRender() {
		return <div className="s13">
			<div className="status" style={{ width: this.screen[0].length * this.pixel_size + "px" }}><p>Tiles: {this.state.tiles}</p><p>Left:{this.state.current}</p><p>Score: {this.score}</p></div>
			<canvas id="solution" ref="canvas" width={this.screen[0].length * this.pixel_size} height={this.screen.length * this.pixel_size} />
			{/*this.renderImage(this.state.output)*/}
			<div className="controls" style={{ width: this.screen[0].length * this.pixel_size + "px" }}>
				<div className="spacer"></div>
				{this.state.result === 0 && <div>
					Game over! Play again? <input type="button" value="PLAY" onClick={() => this.play(false)} />
					<input type="button" value="CHEAT" onClick={() => this.play(true)} />
				</div>}
				<div className="spacer"></div>
			</div>
		</div>;
	}
}

export class S13b extends Solver {
	static hide = true;
}