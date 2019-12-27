// import React from 'react';
import Solver from './Solver';

function newDeck(n) {
	let deck = [];
	deck[n - 1] = n - 1;
	for (let i = 0; i < n - 2; i++) {
		deck[i] = i;
	}
	return deck;
}

function dealWithIncrement(deck, increment) {
	let n = [];
	for (let i = 0; i < deck.length; i++) {
		n[(i * increment) % deck.length] = deck[i];
	}
	return n;
}

function cutDeck(deck, position) {
	while (position < 0) position += deck.length;
	return deck.slice(position).concat(deck.slice(0, position));
}

function reorder(step, rev, deal, cut) {
	if (step === "deal into new stack") rev();
	if (step.startsWith("deal with increment ")) deal(parseInt(step.substring(20), 10));
	if (step.startsWith("cut ")) cut(parseInt(step.substring(4), 10));
}

function shuffle(deck, input) {
	let rev = () => deck.reverse();
	let deal = i => { deck = dealWithIncrement(deck, i) }
	let cut = i => { deck = cutDeck(deck, i) }
	for (let i = 0; i < input.length; i++) {
		reorder(input[i], rev, deal, cut);
	}
	return deck;
}

function longMul(a, b, m) {
	let x = 0;
	a = a % m;
	b = b % m;
	if (b < 0) b += m;
	while (b > 0) {
		x += a * (b % 10);
		x = x % m;
		a = (a * 10) % m;
		b = (b - b % 10) / 10;
	}
	return x;
}

function gcd(a, b) {
	let res = [
		{
			r: Math.min(a, b),
			s: 1,
			t: 0
		},
		{
			r: Math.max(a, b),
			s: 0,
			t: 1
		}
	];
	while (res[0].r > 1) {
		let q = Math.floor(res[1].r / res[0].r);
		res.unshift({
			r: res[1].r - q * res[0].r,
			s: res[1].s - q * res[0].s,
			t: res[1].t - q * res[0].t
		});
	}
	return res;
}

function computeMatrix(a, b, n, m) {
	// Compute {a,b}^n mod m
	// console.log(`a=${a}, b=${b}, n=${n}, m=${m}`);
	if (n === 1) return { a: a, b: b };
	let m2 = computeMatrix(longMul(a, a, m), longMul((a + 1) % m, b, m), Math.floor(n / 2), m);
	if (n % 2 === 1) {
		m2.a = longMul(a, m2.a, m);
		m2.b = (b + longMul(a, m2.b, m)) % m;
	}
	return m2;
}

export class S22a extends Solver {
	test(input) {
		let len = 10007;
		let n = 5;
		let mul = 1;
		let add = 0;
		input = input.split("\n");
		let deck = newDeck(10007);
		for (let i = 0; i < n; i++) { deck = shuffle(deck, input) }
		console.log(`After ${n} shuffles, card 2020 is: ${deck[2020]}`);
		let rev = () => { mul *= -1; add *= -1; add--; }
		let deal = i => {
			let g = gcd(i, len);
			mul = longMul(mul, g[0].s, len);
			add = longMul(add, g[0].s, len);
		}
		let cut = i => { add = (add + i) % len; }
		input.reverse();
		for (let i = 0; i < input.length; i++) { reorder(input[i], rev, deal, cut) }
		let m = computeMatrix(mul, add, n, len);
		let card = (longMul(2020, m.a, len) + m.b) % len;
		if (card < 0) card += len;
		console.log(`Computed card is: ${card}`);
	}

	solve1(input) {
		let len = 10007;
		let mul = 1;
		let add = 0;
		let rev = () => { mul *= -1; add *= -1; add--; }
		let deal = i => { mul *= i; add *= i; mul = mul % len; add = add % len; }
		let cut = i => { add += -i; add = add % len; }
		input = input.split("\n");
		for (let i = 0; i < input.length; i++) { reorder(input[i], rev, deal, cut) }
		let pos = (longMul(mul, 2019, len) + add) % len;
		if (pos < 0) { pos += len; }
		return pos;
	}

	solve2(input) {
		let len = 119315717514047;
		let n = 101741582076661;
		let mul = 1;
		let add = 0;
		let rev = () => { mul *= -1; add *= -1; add--; }
		let deal = i => {
			let g = gcd(len, i);
			mul = longMul(mul, g[0].s, len);
			add = longMul(add, g[0].s, len);
		}
		let cut = i => { add += i; add = add % len; }
		input = input.split("\n");
		input.reverse();
		for (let i = 0; i < input.length; i++) { reorder(input[i], rev, deal, cut) }
		console.log(`Multiplier per iteration: ${mul}`);
		console.log(`Addition per iteration: ${add}`);
		let m = computeMatrix(mul, add, n, len);
		console.log(`Multiplier for n iterations: ${m.a}`);
		console.log(`Addition for n iterations: ${m.b}`);
		let card = (longMul(2020, m.a, len) + m.b) % len;
		if (card < 0) card += len;
		return card;
	}

	solve(input) {
		// this.test(input);
		let pt1 = this.solve1(input);
		let pt2 = this.solve2(input);
		this.setState({ solution: `Index of card 2019: ${pt1}\nCard in position 2020: ${pt2}` });
	}
}

export class S22b extends Solver {
}