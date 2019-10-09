const assert = require('assert');
const fs = require('fs');
const {spawn} = require('child_process');
const PdfPrinter = require('pdfmake');
const Remarkable = require('remarkable');
const plugin = require('../');

const remarkable = new Remarkable();
remarkable.use(plugin);

const DATA_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAB6CAYAAABwWUfkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABuElEQVR4Ae3TQRHAMAzEQDf8Obd9BIW1mTEASblnZt7/vOUGznI+eNeA0JGvILTQEQMRTIsWOmIggmnRQkcMRDAtWuiIgQimRQsdMRDBtGihIwYimBYtdMRABNOihY4YiGBatNARAxFMixY6YiCCadFCRwxEMC1a6IiBCKZFCx0xEMG0aKEjBiKYFi10xEAE06KFjhiIYFq00BEDEUyLFjpiIIJp0UJHDEQwLVroiIEIpkULHTEQwbRooSMGIpgWLXTEQATTooWOGIhgWrTQEQMRTIsWOmIggmnRQkcMRDAtWuiIgQimRQsdMRDBtGihIwYimBYtdMRABNOihY4YiGBatNARAxFMixY6YiCCadFCRwxEMC1a6IiBCKZFCx0xEMG0aKEjBiKYFi10xEAE06KFjhiIYFq00BEDEUyLFjpiIIJp0UJHDEQwLVroiIEIpkULHTEQwbRooSMGIpgWLXTEQATTooWOGIhgWrTQEQMRTIsWOmIggmnRQkcMRDAtWuiIgQimRQsdMRDBtGihIwYimBYtdMRABNOihY4YiGBatNARAxFMixY6YiCCadFCRwxEMC06EvoDKPAB83+i7DEAAAAASUVORK5CYII=';


describe( 'Remarkable PDFMake Plugin', function () {

	it('should parse italicized text', function () {
		
		let parsed1 = remarkable.render('Some *italicized* text');
		let parsed2 = remarkable.render('Some _italicized_ text');
		assert.deepStrictEqual(parsed1, parsed2);
		assert.deepStrictEqual(parsed1, [ 
			{ 
				text: [
					{ text: 'Some ' },
					{ italics: true, text: 'italicized' },
					{ text: ' text' } 
				] 
			},
			'\n'
		]);
		
	});
	
	it('should parse bold text', function () {
		
		let parsed1 = remarkable.render('Some **bold** text');
		let parsed2 = remarkable.render('Some __bold__ text');

		assert.deepStrictEqual(parsed1, parsed2);
		assert.deepStrictEqual(parsed1, [
			{
				text: [
					{ text: 'Some ' },
					{ bold: true, text: 'bold' },
					{ text: ' text' }
				]
			},
			'\n'
		]);
		
	});

	it('should parse underline text', function () {

		let parsed1 = remarkable.render('Some ++underline++ text');

		assert.deepStrictEqual(parsed1, [
			{
				text: [
					{ text: 'Some ' },
					{ decoration: 'underline', text: 'underline' },
					{ text: ' text' }
				]
			},
			'\n'
		]);

	});

	it('should parse a link', function () {
		
		let parsed = remarkable.render('Here\'s a [link to Google!](http://google.com)');
		
		assert.deepStrictEqual(parsed, [
			{
				text: [
					{ text: 'Here\'s a ' },
					{ link: 'http://google.com', text: 'link to Google!' } 
				]
			},
			'\n'
		]);
		
	});

	it('should parse an image', function () {
		
		let parsed = remarkable.render('Here\'s an image: ![Alt text](http://https://octodex.github.com/images/original.png)');
		assert.deepStrictEqual(parsed, [
			{
				text: [
					{ text: 'Here\'s an image: ' },
				]
			},
			{ image: 'http://https://octodex.github.com/images/original.png' },
			'\n' 
		]);
		
	});

	it('should parse relative image', function () {
		
		let parsed = remarkable.render('Here\'s an image: ![Alt text](/images/original.png) as well.');

		assert.deepStrictEqual(parsed, [
			{
				text: [
					{ text: 'Here\'s an image: ' },
				]
			},
			{ image: '/images/original.png' },
			{
				text: [
					{ text: ' as well.' },
				]
			},
			'\n'
		]);
		
	});

	it('should parse a base64 encoded data uri as an image', function () {
				
		let parsed = remarkable.render(`Here's a data uri ![Encoded Img](${DATA_URI})`);
		
		assert.deepStrictEqual(parsed, [
			{
				text: [
					{ text: 'Here\'s a data uri ' }
				]
			},
			{ image: DATA_URI },
			'\n'
		]);
		
	});

	// This will open the PDF assuming you have Preview.app (OSX)
	it.skip('should parse some complex markdown, create and open a pdf.', async function () {
		
		let promise, parsed, writeStream, pdfDoc;
		
		const printer = new PdfPrinter({
				Helvetica: {
					normal: 'Helvetica',
					bold: 'Helvetica-Bold',
					italics: 'Helvetica-Oblique',
					bolditalics: 'Helvetica-BoldOblique'
				}
			}),
			file = '/tmp/markdown.pdf',
			md = [
				'Here we have some Markdown that is **bold** and some *italic* or even _**italibold**_.',
				'Here\'s a [link to Google!](http://google.com)',
				'',
				`You can embed relative images or data URIs: ![Alt text is ignored](${DATA_URI})`,
				'',
				'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.',
			],
			result = [
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
						{ text: 'Here\'s a ' },
						{ link: 'http://google.com', text: 'link to Google!' }
					]
				},
				'\n',
				{
					text: [
						{
							text: 'You can embed relative images or data URIs: '
						}
					]
				},
				{
					image: DATA_URI
				},
				'\n',
				{
					text: [
						{
							text: 'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.'
						}
					] 
				},
				'\n'
			];
		parsed = remarkable.render(md.join('\n'));
		assert.deepStrictEqual(parsed, result);
		
		// This will open the pdf assuming you have Preview.app
		writeStream = fs.createWriteStream(file);
		pdfDoc = printer.createPdfKitDocument({
			content: parsed,
			defaultStyle: {
				font: 'Helvetica'
			}
		});
		
		
		promise = new Promise(function(resolve, reject){
		
			writeStream.on('error', reject);
		
			writeStream.on('finish', function () {
		
				const open = spawn('open', ['-a', '/Applications/Preview.app', file]);
		
				open.stderr.on('data', reject);
				open.on('exit', resolve);
		
			});
		
		});
		
		pdfDoc.pipe(writeStream);
		pdfDoc.end();
		
		return promise;

	});
	
	describe.skip('TODO:', function () {

		it('BUGFIX: should ignore square brackets', function () {
			
			// For some reason this reads as a link and errors
			// because there isn't a url. Not sure why, but wrapped the error
			// in a try catch at lib/parser_rules/inline/links.js:236
			let text = 'Some [squarebracketed] text';
			let parsed = remarkable.render(text);
			assert.deepStrictEqual(parsed, [ 
				{ 
					text: [
						{ text: text },
					] 
				},
				'\n'
			]);
			
		});

		it('should parse an unordered list', function () {});
		it('should parse an ordered list', function () {});
		it('should parse a nested unordered list', function () {});
		it('should parse a nested ordered list', function () {});
		it('should parse a table', function () {});
	});


});
