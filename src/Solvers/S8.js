import React from 'react';
import Solver from './Solver';
import { CssImage } from '../util';

export class S8a extends Solver {
	solve(input) {
		let digits = input.split("").map(c => parseInt(c));
		let layers = [];
		while (digits.length > 0) {
			layers.push(digits.splice(0, 150));
		}

		let zeroes = 150;
		let minzerolayer = null;
		layers.forEach(l => {
			let f = l.filter(x => x === 0);
			if (f.length < zeroes) {
				zeroes = f.length;
				minzerolayer = l;
			}
		});
		let checksum = minzerolayer.filter(x => x === 1).length * minzerolayer.filter(y => y === 2).length;

		let img = [];
		for (let i = 0; i < 150; i++) {
			let r = Math.floor(i / 25);
			let c = i % 25;
			if (c === 0) {
				img[r] = [];
				img[r][24] = 4;
				img[r].fill(4, 0, 25);
			}
			for (let z = 0; z < layers.length; z++) {
				if (img[r][c] === 4 && layers[z][i] !== 2) {
					img[r][c] = layers[z][i];
				}
			}
		}

		// this.drawImage(img);
		this.setState({ checksum: checksum, image: img });
	}

	customRender() {
		let i = 0;
		return <div>
			<CssImage value={this.state.image} colors={["black", "white"]} />
			<p>Checksum: {this.state.checksum}</p>
			{this.state.text && <p>Text:<br />
				{this.state.text.split("\n").map(t => <span key={i++} style={{ fontFamily: 'Courier, monospace', whiteSpace: 'pre' }}>{t}<br /></span>)}
			</p>}
		</div>;
	}

	red = [0, 255];
	green = [0, 255];
	blue = [0, 255];

	drawImage(image) {
		if (!image) return;
		let pixel_size = 4;
		const ctx = this.refs.canvas.getContext('2d');
		let img = ctx.createImageData(25 * pixel_size, 6 * pixel_size);
		let imgPtr = 0;
		for (var y = 0; y < 6 * pixel_size; y++)
			for (var x = 0; x < 25 * pixel_size; x++) {
				let i = Math.floor(y / pixel_size) * 25 + Math.floor(x / pixel_size);
				img.data[imgPtr++] = this.red[image[i]];
				img.data[imgPtr++] = this.green[image[i]];
				img.data[imgPtr++] = this.blue[image[i]];
				img.data[imgPtr++] = 255;
			}
		ctx.putImageData(img, 0, 0);
	}
}

export class S8b extends Solver {
}