import './S13.css';
import '../util/CssImage.css';
import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S13a extends Solver {
	stdin = [];
	stdout = [];
	screen = [];
	score = 0;
	nextInput = 0;
	cheat = false;
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

	solve(input) {
		this.computer = new Computer(input, this.stdin, this.stdout);
		let res = this.computer.run();
		let { blocks } = this.updateScreen();
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
			<div className="status" style={{ width: this.screen[0].length * 15 + "px" }}><p>Tiles: {this.state.tiles}</p><p>Left:{this.state.current}</p><p>Score: {this.score}</p></div>
			{this.renderImage(this.state.output)}
			<div className="controls" style={{ width: this.screen[0].length * 15 + "px" }}>
				<div className="spacer"></div>
				{this.state.result === 1 ? <div>
					{/*<input type="button" value="<" />
					<input type="button" value="+" />
					<input type="button" value=">" />*/}
				</div> : <div>
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