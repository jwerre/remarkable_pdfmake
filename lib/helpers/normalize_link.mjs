import { utils } from 'remarkable';
const {replaceEntities} = utils

export default function normalizeLink(url) {
	var normalized = replaceEntities(url);
	// We shouldn't care about the result of malformed URIs,
	// and should not throw an exception.
	try {
		normalized = decodeURI(normalized);
	} catch (err) {}
	return encodeURI(normalized);
};
