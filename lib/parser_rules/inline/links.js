'use strict';

var parseLinkLabel = require('remarkable/lib/helpers/parse_link_label');
// var parseLinkDestination = require('remarkable/lib/helpers/parse_link_destination');
var parseLinkTitle = require('remarkable/lib/helpers/parse_link_title');
var normalizeReference = require('remarkable/lib/helpers/normalize_reference');
var normalizeLink = require('remarkable/lib/helpers//normalize_link');
var unescapeMd = require('remarkable/lib/common/utils').unescapeMd;

/**
 * Ensure string is a data uri
 *
 * @param  {String} dataUri
 * @api private
 */
function isDataUri(uri) {
	let re = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i;
	return uri.match(re);
}

/**
 * Parse link destination
 *
 *   - on success it returns a string and updates state.pos;
 *   - on failure it returns null
 *
 * @param  {Object} state
 * @param  {Number} pos
 * @api private
 */

function parseLinkDestination(state, pos) {

	var code,
		level,
		link,
		start = pos,
		max = state.posMax;

	if (state.src.charCodeAt(pos) === 0x3C /* < */) {
		pos++;
		while (pos < max) {

			code = state.src.charCodeAt(pos);

			if (code === 0x0A /* \n */) {
				return false;
			}

			if (code === 0x3E /* > */) {
				link = normalizeLink( unescapeMd(state.src.slice(start + 1, pos)));

				if (!state.parser.validateLink(link)) {
					return false;
				}
				
				state.pos = pos + 1;
				state.linkContent = link;
				return true;
			}
			
			if (code === 0x5C /* \ */ && pos + 1 < max) {
				pos += 2;
				continue;
			}

			pos++;
		}

		return false;
	}


	level = 0;
	while (pos < max) {
		code = state.src.charCodeAt(pos);

		if (code === 0x20) { break; }

		if (code > 0x08 && code < 0x0e) { break; }

		if (code === 0x5C /* \ */ && pos + 1 < max) {
			pos += 2;
			continue;
		}

		if (code === 0x28 /* ( */) {
			level++;
			if (level > 1) { break; }
		}

		if (code === 0x29 /* ) */) {
			level--;
			if (level < 0) { break; }
		}

		pos++;
	}
	
	if (start === pos) { return false; }

	link = unescapeMd(state.src.slice(start, pos));
	
	if (!state.parser.validateLink(link) && !isDataUri(link) ) {
		return false;
	}

	state.linkContent = link;
	state.pos = pos;
	return true;

}

module.exports = function links(state, silent) {
	var labelStart,
		labelEnd,
		label,
		href,
		title,
		pos,
		ref,
		code,
		isImage = false,
		oldPos = state.pos,
		max = state.posMax,
		start = state.pos,
		marker = state.src.charCodeAt(start);

	if (marker === 0x21/* ! */) {
		isImage = true;
		marker = state.src.charCodeAt(++start);
	}

	if (marker !== 0x5B/* [ */) { return false; }
	if (state.level >= state.options.maxNesting) { return false; }

	labelStart = start + 1;
	labelEnd = parseLinkLabel(state, start);

	// parser failed to find ']', so it's not a valid link
	if (labelEnd < 0) { return false; }

	pos = labelEnd + 1;
	if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
		//
		// Inline link
		//

		// [link](  <href>  "title"  )
		//        ^^ skipping these spaces
		pos++;
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (code !== 0x20 && code !== 0x0A) { break; }
		}
		if (pos >= max) { return false; }

		// [link](  <href>  "title"  )
		//          ^^^^^^ parsing link destination
		start = pos;

		if ( parseLinkDestination(state, pos) ) {
			href = state.linkContent;
			pos = state.pos;
		} else {
			href = '';
		}
		
		// [link](  <href>  "title"  )
		//                ^^ skipping these spaces
		start = pos;
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (code !== 0x20 && code !== 0x0A) { break; }
		}

		// [link](  <href>  "title"  )
		//                  ^^^^^^^ parsing link title
		if (pos < max && start !== pos && parseLinkTitle(state, pos)) {
			title = state.linkContent;
			pos = state.pos;

			// [link](  <href>  "title"  )
			//                         ^^ skipping these spaces
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (code !== 0x20 && code !== 0x0A) { break; }
			}
		} else {
			title = '';
		}

		if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
			state.pos = oldPos;
			return false;
		}
		pos++;
	} else {
		//
		// Link reference
		//

		// do not allow nested reference links
		if (state.linkLevel > 0) { return false; }

		// [foo]  [bar]
		//      ^^ optional whitespace (can include newlines)
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (code !== 0x20 && code !== 0x0A) { break; }
		}

		if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
			start = pos + 1;
			pos = parseLinkLabel(state, pos);
			if (pos >= 0) {
				label = state.src.slice(start, pos++);
			} else {
				pos = start - 1;
			}
		}

		// covers label === '' and label === undefined
		// (collapsed reference link and shortcut reference link respectively)
		if (!label) {
			if (typeof label === 'undefined') {
				pos = labelEnd + 1;
			}
			label = state.src.slice(labelStart, labelEnd);
		}

		ref = state.env.references[normalizeReference(label)];
		if (!ref) {
			state.pos = oldPos;
			return false;
		}
		href = ref.href;
		title = ref.title;
	}

	//
	// We found the end of the link, and know for a fact it's a valid link;
	// so all that's left to do is to call tokenizer.
	//
	if (!silent) {
		state.pos = labelStart;
		state.posMax = labelEnd;

		if (isImage) {
			state.push({
				type: 'image',
				src: href,
				title: title,
				alt: state.src.substr(labelStart, labelEnd - labelStart),
				level: state.level
			});
		} else {
			state.push({
				type: 'link_open',
				href: href,
				title: title,
				level: state.level++
			});
			state.linkLevel++;
			state.parser.tokenize(state);
			state.linkLevel--;
			state.push({ type: 'link_close', level: --state.level });
		}
	}

	state.pos = pos;
	state.posMax = max;
	return true;
};
