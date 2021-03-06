const fs = require('fs');
const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');

function header(section, name) {
	return fs.readFileSync(path.resolve(__dirname, 'src/_header.ts'), {
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
		nodeResolve(),
		typescript(),
		string({
			include: '**/*.css',
		}),
	],
};
