import React from 'react';
import Solver from './Solver';

class Moon {
	constructor(input) {
		if (input.startsWith("<")) input = input.substring(1);
		if (input.endsWith(">")) input = input.substring(0, input.length - 1);
		input = input.split(", ").map(m => m.split("="));
		this.x = parseInt(input[0][1]);
		this.y = parseInt(input[1][1]);
		this.z = parseInt(input[2][1]);
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
	}

	addGravity(other) {
		if (this.x > other.x) { this.dx--; other.dx++; }
		if (this.x < other.x) { this.dx++; other.dx--; }
		if (this.y > other.y) { this.dy--; other.dy++; }
		if (this.y < other.y) { this.dy++; other.dy--; }
		if (this.z > other.z) { this.dz--; other.dz++; }
		if (this.z < other.z) { this.dz++; other.dz--; }
	}

	move() {
		this.x += this.dx;
		this.y += this.dy;
		this.z += this.dz;
	}

	potentialEnergy() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	kineticEnergy() {
		return Math.abs(this.dx) + Math.abs(this.dy) + Math.abs(this.dz);
	}

	energy() {
		return this.potentialEnergy() * this.kineticEnergy();
	}

	checksum() {
		return this.x + this.y + this.z + this.dx + this.dy + this.dz;
	}

	toString() {
		return `${this.name}: <x=${this.x}, y=${this.y}, z=${this.z}> <dx=${this.dx}, dy=${this.dy}, dz=${this.dz}> pE=${this.potentialEnergy()} kE=${this.kineticEnergy()} E=${this.energy()}`
	}

	toMarkup() {
		return <tr key={this.name}>
			<td>{this.name}</td>
			<td>{this.x}</td>
			<td>{this.y}</td>
			<td>{this.z}</td>
			<td>{this.dx}</td>
			<td>{this.dy}</td>
			<td>{this.dz}</td>
			<td>{this.potentialEnergy()}</td>
			<td>{this.kineticEnergy()}</td>
			<td>{this.energy()}</td>
		</tr>;
	}
}

function moveMoons(moons) {
	for (let i = 0; i < moons.length; i++) {
		for (let j = i + 1; j < moons.length; j++) {
			moons[i].addGravity(moons[j]);
		}
	}
	moons.forEach(m => m.move());
}

function renderMoons(moons) {
	return <table style={{ borderSpacing: "10px 0" }}>
		<thead>
			<tr>
				<th>Name</th>
				<th>X</th>
				<th>Y</th>
				<th>Z</th>
				<th>dX</th>
				<th>dY</th>
				<th>dZ</th>
				<th>pE</th>
				<th>kE</th>
				<th>E</th>
			</tr>
		</thead>
		<tbody>
			{moons.map(m => m.toMarkup())}
		</tbody>
	</table>;
}

function initMoons(input) {
	let moons = input.split("\n").map(m => new Moon(m));
	moons[0].name = "Io";
	moons[1].name = "Europa";
	moons[2].name = "Ganymede";
	moons[3].name = "Callisto";
	return moons;
}

export class S12a extends Solver {
	calculate(input) {
		let moons = initMoons(input);
		let xs = [moons.map(m => m.x.toString()).join("")], ys = [moons.map(m => m.y.toString()).join("")], zs = [moons.map(m => m.z.toString()).join("")];
		let limit = 5000;
		let px = 0, py = 0, pz = 0;
		while (px === 0 || py === 0 || pz === 0) {
			for (let s = Math.max(xs.length, ys.length, zs.length); s < limit; s++) {
				moveMoons(moons);
				if (px === 0) xs.push(moons.map(m => m.x.toString()).join(""));
				if (py === 0) ys.push(moons.map(m => m.y.toString()).join(""));
				if (pz === 0) zs.push(moons.map(m => m.z.toString()).join(""));
			}
			limit *= 2;
			if (px === 0) px = this.calculatePeriod(xs);
			if (py === 0) py = this.calculatePeriod(ys);
			if (pz === 0) pz = this.calculatePeriod(zs);
		}
		// console.log(`px: ${px}, py: ${py}, pz: ${pz}`);
		// console.log(px * py * pz);
		let p = px * py * pz;
		let primes = [2, 3, 5, 7, 11, 13];
		let mx = p / px, my = p / py, mz = p / pz;
		// console.log(`mx: ${mx}, my: ${my}, mz: ${mz}`);
		primes.forEach(prime => {
			while (mx % prime === 0 && my % prime === 0 && mz % prime === 0) {
				mx /= prime;
				my /= prime;
				mz /= prime;
				p /= prime;
			}
		});
		// console.log(`p: ${p}, mx: ${mx}, my: ${my}, mz: ${mz}`);
		this.setState({ period: { tot: p, x: px, y: py, z: pz } });
	}

	calculatePeriod(v) {
		let p = 1;
		while (p < v.length / 2) {
			while (p < v.length / 2 && v[0] !== v[p]) { p++; }
			if (p < v.length / 2) {
				let match = true;
				for (let i = 0; i < p; i++) { if (v[i] !== v[i + p]) { match = false; break; } }
				if (match) {
					// console.log(`Period: ${p}`);
					// console.log(v.slice(0, p));
					// console.log(v.slice(p, p * 2));
					return p;
				}
				p++
			}
		}
		return 0;
	}

	solve(input) {
		let moons = initMoons(input);
		for (let i = 0; i < 1000; i++) { moveMoons(moons); }
		this.setState({ moons: moons });
		setTimeout(() => this.calculate(input), 1);
	}

	customRender() {
		let { moons, period } = this.state;
		if (!moons) return <div></div>;
		return <div>
			<p>Total energy after 1000 steps: {moons.map(m => m.energy()).reduce((t, n) => t + n)}</p>
			<p>&nbsp;</p>
			{renderMoons(moons)}
			<p>&nbsp;</p>
			<p>Period: {period ? period.tot : "Calculating..."}</p>
			{period && <p>Period (X): {period.x}</p>}
			{period && <p>Period (Y): {period.y}</p>}
			{period && <p>Period (Z): {period.z}</p>}
		</div>
	}
}

export class S12b extends Solver {
}