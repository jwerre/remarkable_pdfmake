'use strict';

/**
 * Renderer rules cache
 */

const rules = {};

/**
 * Blockquotes
 */
// rules.blockquote_open = () => {};
// rules.blockquote_close = () => {};

/**
 * Code
 */
// rules.code = (token, idx) => {};

/**
 * Fenced code blocks
 */
// rules.fence = (token, idx, options, env, self) => { };
// rules.fence_custom = {};

/**
 * Headings
 */
// rules.heading_open = (token, idx) => {};
// rules.heading_close = (token, idx) => {};

/**
 * Horizontal rules
 */
// rules.hr = (token, idx) => {};

/**
 * Bullets
 */
// rules.bullet_list_open = (token, idx, options, env) => {};
// rules.bullet_list_close = (token, idx) => {};

/**
 * Ordered list items
 */
// rules.ordered_list_open = (token, idx, options, env) => {};
// rules.ordered_list_close = (token, idx) => {};

/**
 * List items
 */
// rules.list_item_open = (token, idx, options = {}, env) =>  {};
// rules.list_item_close = (token, idx, options, env) => {};

/**
 * Paragraphs
 */
// rules.paragraph_open = (token, idx) => { };
rules.paragraph_close = (token, idx) => {
	return '\n';
};

/**
 * Links
 */
// rules.link_open = (token, idx) => {};
// rules.link_close = () => {};

/**
 * Images
 */
// rules.image = (token, idx, options, env) => {};

/**
 * Tables
 */
// rules.table_open = (token, idx, options, env) => {};
// rules.table_close = (token, idx, options, env) => {};
// rules.thead_open = (token, idx, options, env) => {};
// rules.thead_close = (token, idx, options, env) => {};
// rules.th_open = (token, idx) => {};
// rules.th_close = (token, idx, options, env) => {};
// rules.tbody_open = (token, idx, options, env) => {};
// rules.tbody_close = (token, idx, options, env) => {};
// rules.tr_open = (token, idx, options, env) => {};
// rules.tr_close = (token, idx, options, env) => {};
// rules.td_open = (token, idx, options, env) => {};
// rules.td_close = (token, idx, options, env) => {};

/**
 * Bold
 */
// rules.strong_open = (token, idx, options, env) => {};

/**
 * Italicize
 */
// rules.em_open = () => {};
// rules.em_close = (token, idx) => {};

/**
 * Strikethrough
 */
// rules.del_open = () => {};
// rules.del_close = (token, idx) => {};

/**
 * Insert
 */
// rules.ins_open = () => {};
// rules.ins_close = () => {};

/**
 * Highlight
 */
// rules.mark_open = () => {};
// rules.mark_close = () => {};

/**
 * Super- and sub-script
 */
// rules.sub = (token, idx) => {};
// rules.sup = (token, idx) => {};

/**
 * Breaks
 */
// rules.hardbreak = () => {
// 	return '\n\n';
// };

// rules.softbreak = () => {
// 	return '\n';
// };

/**
 * Text
 */
// rules.text = (token, idx, options, env) => {
// 	return {
// 		text: token.content
// 	};
// };

/**
 * Content
 */
// rules.htmlblock = (token, idx) => {};
// rules.htmltag = (token, idx) => {};

/**
 * Abbreviations, initialism
 */
// rules.abbr_open = (token, idx) => {};
// rules.abbr_close = (token, idx, options, env) => {};

/**
 * Footnotes
 */
// rules.footnote_ref = (token, idx) => {};
// rules.footnote_block_open = (token, idx, options) => {};
// rules.footnote_block_close = () => {};
// rules.footnote_open = (token, idx) => {};
// rules.footnote_close = () => {};
// rules.footnote_anchor = (token, idx) => {};

/**
 * Definition lists
 */
// rules.dl_open = () => {};
// rules.dt_open = () => {};
// rules.dd_open = () => {};
// rules.dl_close = () => {};
// rules.dt_close = () => {};
// rules.dd_close = () => {};

/**
 * Expose `rules`
 */

module.exports = rules;
