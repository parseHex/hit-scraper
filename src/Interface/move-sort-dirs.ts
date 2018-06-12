import * as dom from '../lib/dom-util';

export default function moveSortdirs(node: HTMLInputElement) {
	const sortdirs = dom.get('#sortdirs');
	if (!node.checked) {
		sortdirs.style.display = 'none';
		return;
	}
	sortdirs.style.display = 'inline';
	sortdirs.remove();
	node.parentNode.insertBefore(sortdirs, node.nextSibling);
}
