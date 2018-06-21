const fs = require('fs');
const path = require('path');
const typescript = require('rollup-plugin-typescript2');

function header(section, name) {
	fs.readFileSync(path.resolve(__dirname, 'src/_header.ts'), {
		encoding: 'utf-8',
	});
}

export default {
	input: 'src/index.ts',
	output: {
		name: 'hit_scraper',
		banner: header(),
		file: 'build/hit-scraper.user.js',
		format: 'iife',
	},
	watch: {
		exclude: ['node_modules/**']
	},
	plugins: [
		typescript(/*{ plugin options }*/),
	],
};
