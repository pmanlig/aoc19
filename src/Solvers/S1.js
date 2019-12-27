import Solver from './Solver';

export class S1a extends Solver {
	fuel(x) {
		let a = Math.floor(x / 3) - 2;;
		x = 0;
		while (a > 0) {
			x += a;
			a = Math.floor(a / 3) - 2;
		}
		return x;
	}

	solve(input) {
		let r1 = input.split("\n").filter(s => s !== "").map(s => Math.floor(parseInt(s) / 3) - 2).reduce((t, n) => t + n);
		let r2 = input.split("\n").filter(s => s !== "").map(s => this.fuel(parseInt(s))).reduce((t, n) => t + n);
		this.setState({ solution: `Fuel requirement: ${r1}\nFuel-adjusted fuel requirement: ${r2}` });
	}
}

export class S1b extends Solver {
}