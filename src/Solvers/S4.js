// import React from 'react';
import Solver from './Solver';

class Password {
	constructor(string) {
		this.digits = string.split("").map(c => parseInt(c));
	}

	equal(b) {
		for (var i = 0; i < this.digits.length; i++) if (this.digits[i] !== b.digits[i]) return false;
		return true;
	}

	inc() {
		let i = this.digits.length - 1;
		while (i >= 0) {
			if (this.digits[i] < 9) {
				this.digits[i]++;
				while (i < this.digits.length - 1) {
					i++;
					this.digits[i] = 0;
				}
				return;
			}
			i--;
		}
	}

	good() {
		let res = false;
		for (var i = 0; i < this.digits.length - 1; i++) {
			if (this.digits[i + 1] < this.digits[i]) return false;
			if (this.digits[i + 1] === this.digits[i]) res = true;
		}
		return res;
	}

	good2() {
		let count = 1;
		for (var i = 0; i < this.digits.length - 1; i++) {
			if (this.digits[i + 1] < this.digits[i]) return false;
		}
		for (var j = 1; j < this.digits.length; j++) {
			if (this.digits[j] === this.digits[j - 1]) count++;
			else if (count === 2) return true;
			else count = 1;
		}
		return count === 2;
	}

	toString() {
		return this.digits.join();
	}
}

export class S4a extends Solver {
	async solve(input) {
		let range = input.split("-");
		let from = new Password(range[0]);
		let i = new Password(range[0]);
		let to = new Password(range[1]);
		let count = 0;
		let count2 = 0;
		while (!i.equal(to)) {
			if (i.good()) count++;
			if (i.good2()) count2++;
			i.inc();
		}

		console.log(new Password("112233").good2());
		console.log(new Password("123444").good2());
		console.log(new Password("111122").good2());
		
		this.setState({ solution: `From: ${from.toString()}\nTo: ${to.toString()}\n#passwords(1): ${count}\n#passwords(2): ${count2}` });
	}
}

export class S4b extends Solver {
	show = false;
}