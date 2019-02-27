# Remarkable PDFMake Plugin

Convert markdown text to [PDFMake](https://github.com/bpampuch/pdfmake) arguments.

## Install

```bash
$ npm install --save remarkable_pdfmake
```

## Example

```js

const fs = require('fs');
const PdfPrinter = require('pdfmake');
const Remarkable = require('remarkable');
const remarkablePdfMake = require('remarkable_pdfmake');

const remarkable = new Remarkable();
remarkable.use(remarkablePdfMake);

const md = [
		'Make words **bold** and others *italic*, you can even use _**both**_. Here\'s a [link to Google!](http://google.com)',
		'',
		'If you want to embed images, this is how you do it: ![Image of Yaktocat](data:image/png;base64,...)',
		'',
		'Aliquam tempor lobortis ante, elementum interdum metus ornare at. Etiam id egestas libero, vel malesuada nunc. Quisque pharetra mattis velit quis dapibus. Nullam vel velit pulvinar, mattis est non, porttitor nunc. Fusce lacus enim.',
	];
	
const docDefs = remarkable.render(md.join('\n'));
const printer = new PdfPrinter();

let ws = fs.createWriteStream('markdown.pdf');
let pdfDoc = printer.createPdfKitDocument(docDefs);
pdfDoc.pipe(ws);
pdfDoc.end();

```

## Limitations

Does not parse lists or tables.

## Testing

```bash
$ npm install && npm test
```
