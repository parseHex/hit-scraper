const fs = require('fs');
const path = require('path');
const typescript = require('rollup-plugin-typescript2');

function header(section, name) {
	return new Promise(function (resolve) {
		fs.readFile(path.resolve(__dirname, 'src/_header.js'), {
			encoding: 'utf-8',
		}, function (err, data) {
			if (err) throw err;

			resolve(data);
		});
	});
}

export default {
	input: 'src/index.ts',
	output: {
		file: 'build/hit-scraper.user.js',
		format: 'iife',
	},
	banner: header(),
	watch: {
		exclude: ['node_modules/**']
	},
	name: 'hit_scraper',
	plugins: [
		typescript(/*{ plugin options }*/),
	],
};
