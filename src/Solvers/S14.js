import React from 'react';
import Solver from './Solver';

class Reaction {
	constructor(formulae) {
		formulae = formulae.split(" => ");
		let output = formulae[1].split(" ");
		this.output = { q: parseInt(output[0]), c: output[1] };
		this.input = formulae[0].split(", ").map(i => i.split(" ")).map(i => { return { q: parseInt(i[0]), c: i[1] } });
	}
}

export class S14a extends Solver {
	calculate(n, have) {
		let needs = [{ q: n, c: "FUEL" }];
		let ore = 0;
		let add = (r, m) => {
			if (r.c === "ORE") ore += r.q * m;
			else needs.push({ c: r.c, q: r.q * m });
		}
		while (needs.length > 0) {
			let need = needs.shift();
			if (have[need.c]) {
				if (need.q >= have[need.c]) {
					need.q -= have[need.c];
					have[need.c] = 0;
				} else {
					have[need.c] -= need.q;
					need.q = 0;
				}
			}
			if (need.q > 0) {
				let f = this.reactions[need.c];
				let c = Math.floor(need.q / f.output.q);
				if (need.q % f.output.q !== 0) c++;
				need.q -= f.output.q * c;
				if (need.q < 0) {
					if (have[need.c] === undefined) have[need.c] = -need.q;
					else have[need.c] -= need.q;
				}
				f.input.forEach(i => add(i, c));
			}
		}
		return ore;
	}

	maxHelper() {
		const target = 1000000000000;
		if (this.oreneed < target) {
			this.setState({ maxfuel: this.maxfuel, oreneed: this.oreneed });
			let next = Math.max(Math.floor((target - this.oreneed) / this.oreperfuel), 1);
			this.maxfuel += next;
			this.oreneed += this.calculate(next, this.have);
			setTimeout(() => this.maxHelper(), 1);
		} else {
			this.setState({ done: true });
		}
	}

	calcMaxFuel() {
		this.needs = [];
		this.have = {};
		this.oreneed = 0;
		this.maxfuel = 0;
		this.maxHelper();
	}

	solve(input) {
		input = input.split("\n").map(f => new Reaction(f));
		this.reactions = {};
		input.forEach(r => this.reactions[r.output.c] = r);
		this.oreperfuel = this.calculate(1, {});
		setTimeout(() => this.calcMaxFuel(), 1);
		this.setState({
			reactions: input.length,
			ore: this.oreperfuel
		});
	}

	customRender() {
		return <div>
			<p>Reactions: {this.state.reactions}</p>
			<p>Ore required: {this.state.ore}</p>
			<p>Max fuel: {this.state.maxfuel || "Calculating..."}</p>
			<p>Ore load: {this.state.oreneed || "Calculating..."}</p>
			<p>{this.state.done ? "Done!" : "Calculating..."}</p>
		</div>;
	}
}

export class S14b extends Solver {
	static hide = true;
}