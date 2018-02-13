export default function bubbleNewHits(results) {
	const _old = [];
	const _new = results.filter(function (hitRow) {
		if (hitRow.shine) return true;

		// not shiny; add to _old
		_old.push(hitRow);
		return false;
	});

	return _new.concat(_old);
}
