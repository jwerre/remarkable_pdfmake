'use strict';

const renderRules = require('./lib/render_rules.js');

const disabled = {
	core: [
		// 'block',
		'abbr',
		'references',
		// 'inline',
		'footnote_tail',
		'abbr2',
		'replacements',
		'smartquotes',
		'linkify',
	],
	block: [
		'code',
		'fences',
		'blockquote',
		'hr',
		'list',
		'footnote',
		'heading',
		'lheading',
		'htmlblock',
		'table',
		'deflist',
		// 'paragraph',

	],
	inline: [
		// 'text',
		// 'newline',
		'escape',
		'backticks',
		'del',
		'ins',
		'mark',
		// 'emphasis',
		'sub',
		'sup',
		// 'links',
		'footnote_inline',
		'footnote_ref',
		'autolink',
		'htmltag',
		'entity',
	]
};

const INLINE_GROUP_DELIMS = [
	'text',
	'image',
	'softbreak',
	'hardbreak',
	'_close'
];


function _parseInlineGroup (group) {
	
	var parsed = {};
	
	for (var i = 0; i < group.length; i++) {

		var item = group[i];

		switch (item.type) {

		case 'text':
			parsed.text = item.content;
			break;
		
		case 'strong_open':
			parsed.bold = true;
			break;
		
		case 'em_open':
			parsed.italics = true;
			break;

		case 'ins_open':
			parsed.decoration = 'underline';
			break;

		case 'link_open':
			parsed.link = item.href;
			break;

		case 'image':
			parsed.image = item.src;
			break;
		
		case 'softbreak':
		case 'hardbreak':
			parsed.text = '\n';
			break;
			// default:
				
		}
		
	}
	
	return parsed;
}
 
/**
* Register as a plugin by passing it to `remarkable.use()`.
*
* ```js
* const md = new Remarkable();
* md.use(remarkable_pdfmake);
* const result = md.render(Some **nice** [https://...](Markdown));
* ```
*
* @param {Object} `options`
* @return {String}
*/
function Plugin(md) {
	
	md.core.ruler.disable(disabled.core);
	md.block.ruler.disable(disabled.block);
	md.inline.ruler.disable(disabled.inline);
	md.inline.ruler.enable(['ins']);
	md.renderer.rules = renderRules; // this should be empty

	// replace block rules
	// TODO:
	// md.block.ruler.at( 'list', require('./lib/parser_rules/block/list') );
	// md.block.ruler.at( 'table', require('./lib/parser_rules/block/table') );
	
	// replace inline rules
	// need to modify image parser since data uris are not supported.
	md.inline.ruler.at( 'links', require('./lib/parser_rules/inline/links') );

	
	md.renderer.renderInline = function(tokens, options, env) {
	
		let groups = [],
			group = [],
			stacks = [],
			delimiterRegExp = new RegExp( INLINE_GROUP_DELIMS.join('|') + '$');
	
		for (var i = 0; i < tokens.length; i++) {
			
			let token = tokens[i];
			group.push(token);
			
			if (delimiterRegExp.test(token.type) && token.level === 0) {
				groups.push([...group]);
				group = [];
			}
		}
		
		// this doesn't work since you can't put images inside text blocks
		// var stacks = {
		// 	text: Array.prototype.map.call(groups, _parseInlineGroup)
		// };
		
		let textStack = { text: [] };
		
		for (var i = 0; i < groups.length; i++) {
			
			let item = _parseInlineGroup(groups[i]);

			if (!item.text) {
				// if there is not text push the current stack and reset it
				if (textStack.text.length) {
					stacks.push(textStack);
					textStack = { text: [] };
				}
				// push the image
				stacks.push(item);
			} else {
				textStack.text.push(item);
			}

		}
		
		// if there are still items left in the stack push it
		if (textStack.text.length) {
			stacks.push(textStack);
		}
		
		return stacks;
	};

	
	md.renderer.render = function(tokens, options, env) {
		
		let result = [];
	
		tokens.forEach( (token, i) => {
			
			if (token.type === 'inline') {
				result = result.concat( this.renderInline(token.children, options, env) );
			} else {
				if (typeof this.rules[token.type] === 'function') {
					result.push( this.rules[token.type](tokens, i, options, env, this) );
				}
			}
	
	
		});
	
		return result;
	
	};
	

}

module.exports = Plugin;
