import React from 'react';
import Solver from './Solver';

export class S24a extends Solver {
	bio(map) {
		let i = 1;
		let b = 0;
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] === '#') { b += i; }
				i *= 2;
			}
		}
		return b;
	}

	bugCount(map, x, y) {
		let c = 0;
		if (x > 0 && map[y][x - 1] === '#') c++;
		if (x + 1 < map[y].length && map[y][x + 1] === '#') c++;
		if (y > 0 && map[y - 1][x] === '#') c++;
		if (y + 1 < map.length && map[y + 1][x] === '#') c++;
		return c;
	}

	tick(map) {
		let n = map.map(l => l.slice());
		for (let y = 0; y < n.length; y++) {
			for (let x = 0; x < n[y].length; x++) {
				let b = this.bugCount(map, x, y);
				if (n[y][x] === '#') {
					if (b !== 1) { n[y][x] = '.'; }
				} else if (b === 1 || b === 2) {
					n[y][x] = '#';
				}
			}
		}
		return n;
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split(""));
		let bios = [this.bio(map)];
		while (true) {
			map = this.tick(map);
			let b = this.bio(map);
			if (bios.includes(b)) {
				this.setState({ solution: `First bio score to repeat: ${b}` });
				return;
			} else {
				bios.push(b);
			}
		}
	}
}

export class S24b extends Solver {
	bugCount(maps, l, x, y) {
		let c = 0;

		// Exterior
		if (x === 0 && l > 0 && maps[l - 1][2][1] === '#') { c++; }
		if (y === 0 && l > 0 && maps[l - 1][1][2] === '#') { c++; }
		if (x === 4 && l > 0 && maps[l - 1][2][3] === '#') { c++; }
		if (y === 4 && l > 0 && maps[l - 1][3][2] === '#') { c++; }

		// Interior
		if (x === 2 && y === 1 && l < 400) {
			for (let i = 0; i < 5; i++) {
				if (maps[l + 1][0][i] === '#') { c++; }
			}
		}
		if (x === 2 && y === 3 && l < 400) {
			for (let i = 0; i < 5; i++) {
				if (maps[l + 1][4][i] === '#') { c++; }
			}
		}
		if (x === 1 && y === 2 && l < 400) {
			for (let i = 0; i < 5; i++) {
				if (maps[l + 1][i][0] === '#') { c++; }
			}
		}
		if (x === 3 && y === 2 && l < 400) {
			for (let i = 0; i < 5; i++) {
				if (maps[l + 1][i][4] === '#') { c++; }
			}
		}

		// Self
		if (x > 0 && maps[l][y][x - 1] === '#') { c++; }
		if (x < 4 && maps[l][y][x + 1] === '#') { c++; }
		if (y > 0 && maps[l][y - 1][x] === '#') { c++; }
		if (y < 4 && maps[l][y + 1][x] === '#') { c++; }

		return c;
	}

	tick(maps) {
		let n = [];
		for (let l = 0; l <= 400; l++) {
			n[l] = maps[l].map(m => m.map(l => l.slice()));
			for (let y = 0; y < 5; y++) {
				for (let x = 0; x < 5; x++) {
					if (x !== 2 || y !== 2) {
						let b = this.bugCount(maps, l, x, y);
						if (n[l][y][x] === '#') {
							if (b !== 1) { n[l][y][x] = '.'; }
						} else if (b === 1 || b === 2) {
							n[l][y][x] = '#';
						}
					}
				}
			}
		}
		return n;
	}

	countBugs(maps) {
		let n = 0;
		maps.forEach(m => {
			for (let y = 0; y < 5; y++) {
				for (let x = 0; x < 5; x++) {
					if ((y !== 2 || x !== 2) && m[y][x] === '#') { n++; }
				}
			}
		});
		return n;
	}

	passTime(maps) {
		if (this.state.ticks === 200) {
			this.setState({ answer: this.countBugs(maps) });
			return;
		}
		maps = this.tick(maps);
		this.setState({ ticks: this.state.ticks + 1, maps: maps });
		setTimeout(() => this.passTime(maps), 1);
	}

	assert(maps, l, x, y, exp) {
		let act = this.bugCount(maps, l, x, y);
		if (act !== exp) { console.log(`bugCount(${l},${x},${y}) should be ${exp} but was ${act}!`); }
	}

	logMap(map) {
		for (let y = 0; y < 5; y++) {
			console.log("" + y + ": " + map[y].join(""));
		}
	}

	solve(input) {
		let maps = [];
		maps[200] = input.split("\n").map(l => l.split(""));
		for (let i = 0; i <= 400; i++) {
			if (i !== 200) {
				maps[i] = maps[200].map(l => l.map(() => '.'));
			}
		}

		this.setState({ ticks: 0, maps });
		setTimeout(() => this.passTime(maps), 10);
	}

	customRender() {
		return <div>
			<p>Step: {this.state.ticks}</p>
			{this.state.answer && <p>Number of bugs: {this.state.answer}</p>}
			<div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
				{this.state.maps && this.state.maps[199].map((l, i) => <p key={1990 + i}>{l.join("")}</p>)}
				<p>&nbsp;</p>
				{this.state.maps && this.state.maps[200].map((l, i) => <p key={2000 + i}>{l.join("")}</p>)}
				<p>&nbsp;</p>
				{this.state.maps && this.state.maps[201].map((l, i) => <p key={2010 + i}>{l.join("")}</p>)}
			</div>
		</div>;
	}
}