import React from 'react';
import Solver from './Solver';

function fill(num, positions) {
	if (num === undefined) return "";
	if (num < 0) return "-" + fill(-num, positions - 1);
	let res = num.toString();
	while (res.length < positions) res = "0" + res;
	return res;
}

function dass(mem, ip, positions) {
	let i = ip;
	let m = [];
	while (positions-- > 0) { m.push(fill(mem[i++], 5)); }
	return `${fill(ip, 4)}: {${m.join(", ")}}`;
}

function calc(mem, stdin) {
	let stdout = [];
	let disass = [];
	let instr = [
		{ op: (mem, ip) => { disass.push(`${dass(mem, ip, 4)} NOP`); return ip + 1; }, p: [] },
		{ op: (mem, ip, a, b, c) => { mem[c] = a + b; disass.push(`${dass(mem, ip, 4)} mem[${c}] = ${a}+${b} (${mem[c]})`); return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a, b, c) => { mem[c] = a * b; disass.push(`${dass(mem, ip, 4)} mem[${c}] = ${a}*${b} (${mem[c]})`); return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a) => { mem[a] = stdin.shift(); disass.push(`${dass(mem, ip, 2)} input mem[${a}] (${mem[a]})`); return ip + 2; }, p: [false] },
		{ op: (mem, ip, a) => { stdout.push(a); disass.push(`${dass(mem, ip, 2)} output ${a}`); return ip + 2; }, p: [true] },
		{ op: (mem, ip, a, b) => { disass.push(`${dass(mem, ip, 3)} jmt ${a}, ${b}`); return a ? b : ip + 3; }, p: [true, true] },
		{ op: (mem, ip, a, b) => { disass.push(`${dass(mem, ip, 3)} jmf ${a}, ${b}`); return a ? ip + 3 : b; }, p: [true, true] },
		{ op: (mem, ip, a, b, c) => { disass.push(`${dass(mem, ip, 4)} less ${a}, ${b}, ${c} (${a < b})`); mem[c] = a < b ? 1 : 0; return ip + 4; }, p: [true, true, false] },
		{ op: (mem, ip, a, b, c) => { disass.push(`${dass(mem, ip, 4)} eq ${a}, ${b}, ${c} (${a === b})`); mem[c] = a === b ? 1 : 0; return ip + 4; }, p: [true, true, false] },
	];

	let ip = 0;
	while (mem[ip] !== 99) {
		let opcode = mem[ip];
		let op = instr[opcode % 100];
		let a = mem[ip + 1];
		let b = mem[ip + 2];
		let c = mem[ip + 3];
		if (opcode % 1000 < 100 && op.p[0]) a = mem[a];
		if (opcode % 10000 < 1000 && op.p[1]) b = mem[b];
		if (opcode % 100000 < 10000 && op.p[2]) c = mem[c];
		ip = op.op(mem, ip, a, b, c);
	}

	return { mem: mem, stdout: stdout, disassembly: disass };
}

export class S5a extends Solver {
	runControls = true;
	state = { input: 1, disassembly: [], memory: [] }

	async solve(input) {
		if (input) {
			let mem = input.split(",").map(s => parseInt(s));
			let stdin = [this.state.input];
			let res = calc(mem, stdin);
			this.setState({
				memory: res.mem,
				output: res.stdout,
				disassembly: res.disassembly
			});
		}
	}

	memrow = p => {
		return null;
	}

	memrows = p => {
		let i = 0;
		let rows = [];
		while (i < p.value.length) {
			rows.push(<tr key={i}>
				<td>{fill(i, 3)}:</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
				<td>{fill(p.value[i++], 5)}</td>
			</tr>);
		}
		return rows;
	}

	memoryTable = p => {
		if (!p.value) return null;
		return <div>
			<p>Memory: {p.value.length} positions</p>
			<table>
				<tbody>
					<this.memrows value={p.value} />
				</tbody>
			</table></div>;
	}

	customRender = p => {
		return <div>
			<div>Input: <input value={this.state.input} onChange={e => this.setState({ input: parseInt(e.target.value) || 0 })} /></div>
			<div>{this.state.output && "Output: " + this.state.output.join(", ")}</div>
			{/*
			<div>Debug:<br />{this.state.disassembly && this.state.disassembly.map(d => <span>{d}<br /></span>)}</div>
			*/}
			<this.memoryTable value={this.state.memory} />
		</div>;
	}
}

export class S5b extends S5a {
	state = { input: 5, disassembly: [], memory: [] }
}