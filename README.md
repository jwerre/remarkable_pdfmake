# Remarkable PDFMake Plugin

A [Remarkable](https://github.com/jonschlinkert/remarkable) plugin that converts Markdown to [PDFMake](https://github.com/bpampuch/pdfmake) arguments.

## Install

```bash
$ npm install --save remarkable_pdfmake
```

## Example

```js
import fs from 'fs',
import { spawnSync } from 'child_process';
import PdfPrinter from 'pdfmake',
import {Remarkable} from 'remarkable',
import remarkablePdfMake from 'remarkable_pdfmake';

const remarkable = new Remarkable();
remarkable.use(remarkablePdfMake);

const printer = new PdfPrinter({
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
});
const file = '/tmp/markdown.pdf'
const markdown = [
	'Here we have some Markdown that is **bold** and some *italic* or even _**italibold**_.',
	'Here\'s a [link to Google!](http://google.com)',
	'',
	`You can embed relative images or data URIs: ![Alt text is ignored](data:image/png;base64,iVBOR...)`,
],


const parsed = remarkable.render(markdown.join('\n'));
const writeStream = fs.createWriteStream(file);

writeStream.on('finish', function () {
	spawnSync('open', [file]); // open the PDF after created
});

const pdfDoc = printer.createPdfKitDocument({
	content: parsed,
	defaultStyle: { font: 'Helvetica' }
});

pdfDoc.pipe(writeStream);
pdfDoc.end();
```

## Limitations

Does not parse lists or tables but feel free to submit a pull request.

## Testing

```bash
$ npm install && npm test
```
