import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { spawnSync } from 'child_process'; // to open pdf
import pdfmake from 'pdfmake';
import { Remarkable } from 'remarkable';
import plugin from '../index.js';
import { DATA_URI } from './assets/data_uri.js';

const OPEN_TEST_PDF = false; // change to true to open test pdf.

describe('Integration', function () {
	const remarkable = new Remarkable();
	remarkable.use(plugin);

	it('should parse some complex markdown, create and open a pdf.', async function () {
		const file = '/tmp/markdown.pdf';
		const md = [
			'Here we have some Markdown that is **bold** and some *italic* or even _**italibold**_.',
			"Here's a [link to Google!](http://google.com)",
			'',
			`You can embed relative images or data URIs: ![Alt text is ignored](${DATA_URI})`,
			'',
			'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.', // cspell:disable-line
		];

		const parsed = remarkable.render(md.join('\n'));
		// console.log(parsed);
		expect(parsed).toStrictEqual([
			{
				text: [
					{ text: 'Here we have some Markdown that is ' },
					{ bold: true, text: 'bold' },
					{ text: ' and some ' },
					{ italics: true, text: 'italic' },
					{ text: ' or even ' },
					{ italics: true, bold: true, text: 'italibold' },
					{ text: '.' },
					{ text: '\n' },
					{ text: "Here's a " },
					{ link: 'http://google.com', text: 'link to Google!' },
				],
			},
			'\n',
			{
				text: [
					{
						text: 'You can embed relative images or data URIs: ',
					},
				],
			},
			{
				image: DATA_URI,
			},
			'\n',
			{
				text: [
					{
						text: 'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.', // cspell:disable-line
					},
				],
			},
			'\n',
		]);

		pdfmake.setUrlAccessPolicy(() => true); // silence security warnings
		pdfmake.addFonts({
			Helvetica: {
				normal: 'Helvetica',
				bold: 'Helvetica-Bold',
				italics: 'Helvetica-Oblique',
				bolditalics: 'Helvetica-BoldOblique',
			},
		});

		const docDefinition = {
			content: parsed,
			defaultStyle: { font: 'Helvetica' },
		};

		const pdf = pdfmake.createPdf(docDefinition);
		await pdf.write(file);

		expect(fs.existsSync(file), 'File should exist on disk').toBe(true);

		const stats = fs.statSync(file);
		expect(stats.size, 'File should not be empty').toBeGreaterThan(0);

		const buffer = fs.readFileSync(file);
		expect(buffer.toString('utf8', 0, 5)).toBe('%PDF-');

		if (OPEN_TEST_PDF) {
			// Use 'open' for macOS, 'xdg-open' for Linux
			spawnSync('open', [file]);
		}
	});
});
