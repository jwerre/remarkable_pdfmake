const assert = require('assert');
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
			}
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
			}
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
			}
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
			{ image: 'http://https://octodex.github.com/images/original.png' } 
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
			{ image: DATA_URI } 
		]);
		
	});


	it('should parse some complex markdown', function () {

		const md = [
				'*em*',
				'this is *Italicized* text',
				'_**italibold**_',
				'**bold** some *italic* with _**italibold**_ Markdown',
				'make words **bold** and others *italic*, you can even use _**italibold**_. Here\'s a [link to Google!](http://google.com)',
				'',
				'If you want to embed images, this is how you do it: ![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)',
				'',
				'',
				'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.',
			],
			result = [
				{ 
					text: [
						{ italics: true, text: 'em' },
						{ text: '\n' },
						{ text: 'this is ' },
						{ italics: true, text: 'Italicized' },
						{ text: ' text' },
						{ text: '\n' },
						{ italics: true, bold: true, text: 'italibold' },
						{ text: '\n' },
						{ bold: true, text: 'bold' },
						{ text: ' some ' },
						{ italics: true, text: 'italic' },
						{ text: ' with ' },
						{ italics: true, bold: true, text: 'italibold' },
						{ text: ' Markdown' },
						{ text: '\n' },
						{ text: 'make words ' },
						{ bold: true, text: 'bold' },
						{ text: ' and others ' },
						{ italics: true, text: 'italic' },
						{ text: ', you can even use ' },
						{ italics: true, bold: true, text: 'italibold' },
						{ text: '. Here\'s a ' },
						{ link: 'http://google.com', text: 'link to Google!' }
					]
				},
				{
					text: [
						{
							text: 'If you want to embed images, this is how you do it: '
						}
					]
				},
				{
					image: 'https://octodex.github.com/images/yaktocat.png'
				},
				{
					text: [
						{
							text: 'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.'
						}
					] 
				}
			];

		let parsed = remarkable.render(md.join('\n'));
		// console.log( require('util').inspect(parsed, {depth:5, colors:true}) );
		assert.deepStrictEqual(parsed, result);
	});
	
	describe.skip('TODO:', function () {
		it('should parse an unordered list', function () {});
		it('should parse an ordered list', function () {});
		it('should parse a nested unordered list', function () {});
		it('should parse a nested ordered list', function () {});
		it('should parse a table', function () {});
	});


});
