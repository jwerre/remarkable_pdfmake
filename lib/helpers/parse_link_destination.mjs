import normalizeLink from './normalize_link.mjs';
import { utils } from 'remarkable';
const { unescapeMd } = utils;

/**
 * Ensure string is a data uri
 *
 * @param  {String} dataUri
 * @api private
 */
function isDataUri(uri) {
	let re =
		/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i;
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
export default function parseLinkDestination(state, pos) {
	var code,
		level,
		link,
		start = pos,
		max = state.posMax;

	if (state.src.charCodeAt(pos) === 0x3c /* < */) {
		pos++;
		while (pos < max) {
			code = state.src.charCodeAt(pos);

			if (code === 0x0a /* \n */) {
				return false;
			}

			if (code === 0x3e /* > */) {
				link = normalizeLink(
					unescapeMd(state.src.slice(start + 1, pos))
				);

				if (!state.parser.validateLink(link)) {
					return false;
				}

				state.pos = pos + 1;
				state.linkContent = link;
				return true;
			}

			if (code === 0x5c /* \ */ && pos + 1 < max) {
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

		if (code === 0x20) {
			break;
		}

		if (code > 0x08 && code < 0x0e) {
			break;
		}

		if (code === 0x5c /* \ */ && pos + 1 < max) {
			pos += 2;
			continue;
		}

		if (code === 0x28 /* ( */) {
			level++;
			if (level > 1) {
				break;
			}
		}

		if (code === 0x29 /* ) */) {
			level--;
			if (level < 0) {
				break;
			}
		}

		pos++;
	}

	if (start === pos) {
		return false;
	}

	link = unescapeMd(state.src.slice(start, pos));

	if (!state.parser.validateLink(link) && !isDataUri(link)) {
		return false;
	}

	state.linkContent = link;
	state.pos = pos;
	return true;
}
