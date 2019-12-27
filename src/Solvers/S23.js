// import React from 'react';
import Solver from './Solver';
import { Computer } from './IntCode';

export class S23a extends Solver {
	solve(input) {
		let net = [];
		let nat = {};
		let firstY = false;
		let sent = [];
		for (let i = 0; i < 50; i++) {
			net[i] = new Computer().init(input, [i, -1]);
		}
		while (true) {
			let idle = true;
			for (let i = 0; i < 50; i++) {
				let cmp = net[i];
				if (cmp.stdin.length === 0) {
					cmp.stdin.push(-1);
				} else {
					idle = false;
				}
				cmp.run();
				while (cmp.stdout.length > 0) {
					let tgt = cmp.stdout.shift();
					let x = cmp.stdout.shift();
					let y = cmp.stdout.shift();
					if (tgt < 50) {
						net[tgt].stdin.push(x);
						net[tgt].stdin.push(y);
						idle = false;
					}
					if (tgt === 255) {
						if (firstY === false) { firstY = y; }
						nat.x = x;
						nat.y = y;
					}
				}
			}
			if (idle) {
				net[0].stdin.push(nat.x);
				net[0].stdin.push(nat.y);
				sent.push(nat.y);
				if (sent.filter(v => v === nat.y).length > 1) {
					this.setState({ solution: `First Y sent to NAT: ${firstY}\nFirst duplicate Y sent by NAT: ${nat.y}` });
					return;
				}
			}
		}
	}
}

export class S23b extends Solver {
}