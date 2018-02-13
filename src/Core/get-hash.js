export default function (str) {
	var hash = 0, ch;
	for (var i = 0; i < str.length; i++) {
		ch = str.charCodeAt(i);
		hash = ch + (hash << 6) + (hash << 16) - hash;
	}
	return hash;
}
