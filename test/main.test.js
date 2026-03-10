import { describe, it, expect } from 'vitest';
import { Remarkable } from 'remarkable';
import plugin from '../index.js';
import { DATA_URI } from './assets/data_uri.js';

describe('Remarkable PDFMake plugin', function () {
	const remarkable = new Remarkable();
	remarkable.use(plugin);

	it('should parse italicized text', function () {
		let parsed1 = remarkable.render('Some *italicized* text');
		let parsed2 = remarkable.render('Some _italicized_ text');
		expect(parsed1).toStrictEqual(parsed2);
		expect(parsed1).toStrictEqual([
			{
				text: [
					{ text: 'Some ' },
					{ italics: true, text: 'italicized' },
					{ text: ' text' },
				],
			},
			'\n',
		]);
	});

	it('should parse bold text', function () {
		let parsed1 = remarkable.render('Some **bold** text');
		let parsed2 = remarkable.render('Some __bold__ text');

		expect(parsed1).toStrictEqual(parsed2);
		expect(parsed1).toStrictEqual([
			{
				text: [
					{ text: 'Some ' },
					{ bold: true, text: 'bold' },
					{ text: ' text' },
				],
			},
			'\n',
		]);
	});

	it('should parse underline text', function () {
		let parsed1 = remarkable.render('Some ++underline++ text');

		expect(parsed1).toStrictEqual([
			{
				text: [
					{ text: 'Some ' },
					{ decoration: 'underline', text: 'underline' },
					{ text: ' text' },
				],
			},
			'\n',
		]);
	});

	it('should parse a link', function () {
		let parsed = remarkable.render(
			"Here's a [link to Google!](http://google.com)"
		);

		expect(parsed).toStrictEqual([
			{
				text: [
					{ text: "Here's a " },
					{ link: 'http://google.com', text: 'link to Google!' },
				],
			},
			'\n',
		]);
	});

	it('should ignore square brackets (bugfix)', function () {
		// For some reason this reads as a link and errors
		// because there isn't a url. Not sure why, but wrapped the error
		// in a try catch at lib/parser_rules/inline/links.js:236
		let text = 'Some [square-bracketed] text';
		let parsed = remarkable.render(text);
		expect(parsed).toStrictEqual([
			{
				text: [{ text: text }],
			},
			'\n',
		]);
	});

	it('should parse an image', function () {
		let parsed = remarkable.render(
			"Here's an image: ![Alt text](http://https://octodex.github.com/images/original.png)"
		);
		expect(parsed).toStrictEqual([
			{
				text: [{ text: "Here's an image: " }],
			},
			{ image: 'http://https://octodex.github.com/images/original.png' },
			'\n',
		]);
	});

	it('should parse relative image', function () {
		let parsed = remarkable.render(
			"Here's an image: ![Alt text](/images/original.png) as well."
		);

		expect(parsed).toStrictEqual([
			{
				text: [{ text: "Here's an image: " }],
			},
			{ image: '/images/original.png' },
			{
				text: [{ text: ' as well.' }],
			},
			'\n',
		]);
	});

	it('should parse a base64 encoded data uri as an image', function () {
		let parsed = remarkable.render(
			`Here's a data uri ![Encoded Img](${DATA_URI})`
		);

		expect(parsed).toStrictEqual([
			{
				text: [{ text: "Here's a data uri " }],
			},
			{ image: DATA_URI },
			'\n',
		]);
	});

	it.todo('should parse an unordered list', function () {});
	it.todo('should parse an ordered list', function () {});
	it.todo('should parse a nested unordered list', function () {});
	it.todo('should parse a nested ordered list', function () {});
	it.todo('should parse a table', function () {});
});
