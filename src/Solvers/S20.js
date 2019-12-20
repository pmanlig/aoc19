import React from 'react';
import Solver from './Solver';

export class S20a extends Solver {
	registerPortal(portals) { }

	findDownPortal(map, x, y, portals, portalMap) {
		let c = map[y][x];
		if (c >= 'A' && c <= 'Z') { // Found portal
			let port = c + map[1][x];
			portalMap[port] = { x: x, y: 2 };
		}
	}

	findPortals(map) {
		let portals = map.map(l => l.map(() => undefined));
		let portalMap = {};
		for (let x = 0; x < map[0].length; x++) {
			this.findDownPortal(map, x, 0, portals, portalMap);
		}
		for (let y = 0; y < map.length; y++) {
		}
	}

	solve(input) {
		let map = input.split("\n").map(l => l.split(""));
		let portals = this.findPortals(map);
		this.setState({ map: map });
	}

	customRender() {
		let i = 0;
		return <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
			{this.state.map && this.state.map.map(l => <p key={i++}>{l.join("")}</p>)}
		</div>;
	}
}

export class S20b extends Solver {
	static hide = true;
}