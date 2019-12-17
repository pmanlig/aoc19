import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';
import { drawCircle, drawFilledCircle } from '../util';

export class S17a extends Solver {
	pixel_size = 13;
	state = {
		w: 0,
		h: 0,
		main: "B,C,B,C,B,A,C,A,B,A",
		subA: "L,8,L,8,R,10,R,4",
		subB: "R,4,L,10,L,10",
		subC: "L,8,R,12,R,10,R,4",
		feed: "y"
	}

	drawScaffold(ctx, x, y) {
		let fromX = x * this.pixel_size, toX = (x + 1) * this.pixel_size - 1;
		let fromY = y * this.pixel_size, toY = (y + 1) * this.pixel_size - 1;
		let x1 = Math.floor((x + 0.5) * this.pixel_size) - 3;
		let x2 = x1 + 7;
		let y1 = Math.floor((y + 0.5) * this.pixel_size) - 3;
		let y2 = y1 + 7;
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(fromX, y1);
		ctx.lineTo(toX, y1);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(fromX, y2);
		ctx.lineTo(toX, y2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x1, fromY);
		ctx.lineTo(x1, toY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x2, fromY);
		ctx.lineTo(x2, toY);
		ctx.stroke();
	}

	drawRobot(ctx, x, y, c) {
		x = Math.floor((x + 0.5) * this.pixel_size);
		y = Math.floor((y + 0.5) * this.pixel_size);
		drawFilledCircle(ctx, x, y, 5, c === "X" ? "#FF7F7F" : "#FFFF7F");
		drawCircle(ctx, x, y, 5, "#000000");
	}

	drawImage(img) {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, this.state.w * this.pixel_size, this.state.h * this.pixel_size);
		for (let y = 0; y < img.length; y++) {
			for (let x = 0; x < img[y].length; x++) {
				if ("#" === img[y][x]) this.drawScaffold(ctx, x, y);
				if ("^<>vV".includes(img[y][x])) this.drawRobot(ctx, x, y, img[y][x]);
				if ("X" === img[y][x]) this.drawRobot(ctx, x, y, img[y][x]);
			}
		}
	}

	solve(input) {
		let c = new Computer().init(input);
		while (c.run() === 1);
		let alignment = 0;
		let img = c.stdout.map(c => String.fromCharCode(c)).join("").split("\n").filter(l => !l.startsWith("M")).filter(l => l && l.length > 0).map(l => l.split(""));
		console.log(img);
		for (let y = 1; y < img.length - 1; y++) {
			for (let x = 1; x < img[y].length - 1; x++) {
				if (img[y][x] === "#" && img[y + 1][x] === "#" && img[y - 1][x] === "#" && img[y][x + 1] === "#" && img[y][x - 1] === "#") {
					alignment += x * y;
					// c.stdout[y * (img[0].length + 1) + x] = "O".charCodeAt(0);
				}
			}
		}
		setTimeout(() => this.drawImage(img), 10);
		this.setState({ prg: input, img: img, alignment: alignment, w: img[0].length, h: img.length });
	}

	consumeLine(c) {
		while (c.stdout[c.read] !== 10) c.read++;
		while (c.stdout[c.read] === 10) c.read++;
	}

	readOutput(c) {
		if (c.read < c.stdout.length - 1) {
			while ("MFC".includes(String.fromCharCode(c.stdout[c.read]))) this.consumeLine(c);
			let img = [];
			for (let y = 0; y < this.state.img.length; y++) {
				img[y] = [];
				for (let x = 0; x < this.state.img[y].length; x++) {
					img[y][x] = String.fromCharCode(c.stdout[c.read++]);
				}
				this.consumeLine(c);
			}

			this.drawImage(img);
			this.setState({ img: img });
			setTimeout(() => this.readOutput(c), 20);
		} else {
			this.setState({ dust: c.stdout[c.read] });
		}
	}

	runProgram() {
		let c = new Computer().init(this.state.prg);
		c.mem[0] = 2;
		let p = `${this.state.main}\n${this.state.subA}\n${this.state.subB}\n${this.state.subC}\n${this.state.feed}\n`;
		for (let i = 0; i < p.length; i++) {
			c.stdin.push(p.charCodeAt(i));
		}
		c.run();
		c.read = 0;
		this.readOutput(c);
	}

	customRender() {
		let i = 0;
		return <div style={{ display: "flex", flexDirection: "row" }}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<p>Alignment: {this.state.alignment}</p>
				<canvas id="solution" ref="canvas" width={this.state.w * this.pixel_size} height={this.state.h * this.pixel_size} />
				{this.state.output && this.state.output.map(c => String.fromCharCode(c)).join("").split("\n").map(s => <p key={i++} style={{ whiteSpace: "pre", fontFamily: "monospace" }}>{s}</p>)}
			</div>
			<div style={{
				display: "inline-grid",
				gridTemplateColumns: "auto auto",
				gridGap: "10px",
				alignContent: "start"
			}}>
				<span>Main program:</span> <span><input value={this.state.main} onChange={e => this.setState({ main: e.target.value })} /></span>
				<span>Subroutine A:</span> <span><input value={this.state.subA} onChange={e => this.setState({ subA: e.target.value })} /></span>
				<span>Subroutine B:</span> <span><input value={this.state.subB} onChange={e => this.setState({ subB: e.target.value })} /></span>
				<span>Subroutine C:</span> <span><input value={this.state.subC} onChange={e => this.setState({ subC: e.target.value })} /></span>
				<span>Continuous feed:</span> <span><input value={this.state.feed} onChange={e => this.setState({ feed: e.target.value })} /></span>
				<input type="button" value="Run!" onClick={() => this.runProgram()} /> <span></span>
				{this.state.dust && <span>Dust: {this.state.dust}</span>}
			</div>
		</div >;
	}
}

export class S17b extends Solver {
	static hide = true;
}