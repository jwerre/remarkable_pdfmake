# Remarkable PDFMake Plugin

A [Remarkable](https://github.com/jonschlinkert/remarkable) plugin that converts Markdown to [PDFMake](https://github.com/bpampuch/pdfmake) arguments.

## Install

```bash
$ npm install --save remarkable_pdfmake
```

## Example

```js

const fs = require('fs'),
	PdfPrinter = require('pdfmake'),
	Remarkable = require('remarkable'),
	remarkablePdfMake = require('remarkable_pdfmake');
	remarkable = new Remarkable(),
	printer = new PdfPrinter({
		Helvetica: {
			normal: 'Helvetica',
			bold: 'Helvetica-Bold',
			italics: 'Helvetica-Oblique',
			bolditalics: 'Helvetica-BoldOblique'
		}
	}),
	file = '/tmp/markdown.pdf'
	md = [
		'Here we have some Markdown that is **bold** and some *italic* or even _**italibold**_.',
		'Here\'s a [link to Google!](http://google.com)',
		'',
		`You can embed relative images or data URIs: ![Alt text is ignored](${DATA_URI})`,
	],

remarkable.use(plugin);

let promise, parsed, writeStream, pdfDoc;

parsed = remarkable.render(md.join('\n'));

writeStream = fs.createWriteStream(file);

pdfDoc = printer.createPdfKitDocument({
	content: parsed,
	defaultStyle: {
		font: 'Helvetica'
	}
});

pdfDoc.pipe(writeStream);
pdfDoc.end();

```

## Limitations

Does not parse lists or tables.

## Testing

```bash
$ npm install && npm test
```
