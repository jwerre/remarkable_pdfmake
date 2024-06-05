import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import terser from '@rollup/plugin-terser';

const files = globSync('lib/**/*.mjs')
.map(file => {
	const key = path.relative(
		'lib',
		file.slice(0, file.length - path.extname(file).length)
	);
	const value = fileURLToPath(new URL(file, import.meta.url))
	return [`lib/${key}`, value]
});

const input = Object.fromEntries(files);
input.index = './index.mjs';

export default {
	input,
	output: [
		{
			dir: 'dist/cjs',
			format: 'cjs',
		},
		{
			dir: 'dist/esm',
			format: 'esm',
		},
	],
	external: ['remarkable'],
	plugins: [terser()],
};
