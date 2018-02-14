import Settings from '../Settings/index';
import Editor from '../Editor/index';
import { INCLUDE_KEY, IGNORE_KEY } from '../lib/constants';

export default function (...needles) {
	var found = [false, false]
	var s;
	if (Settings.user.onlyIncludes) { // everything not in includelist gets blocked, unless includelist is empty or doesn't exist
		var list = (localStorage.getItem(INCLUDE_KEY) || '').toLowerCase().split('^');
		if (list.length === 1 && !list[0].length) return found; // includelist is empty
		for (s of needles) {
			found[1] = Boolean(~list.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
			if (found[1]) {
				found[0] = false;
				break;
			} else
				found[0] = true;
		}
	} else {
		if (localStorage.getItem(IGNORE_KEY) === null) {
			new Editor().setDefaultBlocks();
		}

		const blist = (localStorage.getItem(IGNORE_KEY) || '').toLowerCase().split('^');
		const ilist = (localStorage.getItem(INCLUDE_KEY) || '').toLowerCase().split('^')
		const blist_wild = Settings.user.wildblocks ? blist.filter(v => /.*?[*].*/.test(v)) : null;

		if (blist_wild) {
			blist_wild.forEach((v, i, a) => {
				let regex = v;
				regex = regex.replace(/([+${}[\](\)^|?.\\])/g, '\\$1'); // escape non wildcard special chars
				regex = regex.replace(/([^*]|^)[*](?!\*)/g, '$1.*'); // turn glob into regex
				regex = regex.replace(/\*{2,}/g, s => s.replace(/\*/g, '\\$&')); // escape consecutive asterisks

				a[i] = new RegExp('^' + regex + '$', 'i'); // escape consecutive asterisks
			});
		}
		for (s of needles) {
			found[0] = found[0] || Boolean(~blist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
			found[1] = found[1] || Boolean(~ilist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));

			if (blist_wild && blist_wild.length && !found[0]) {
				for (var i = 0; !found[0] && i < blist_wild.length; i++) {
					found[0] = blist_wild[i].test(s.toLowerCase().replace(/\s+/g, ' '));
				}
			}
		}
	}
	return found; // [ blocklist,includelist ]
}
