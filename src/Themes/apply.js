export default function (theme, mode) {
	var cssNew = URL.createObjectURL(new Blob([this.generateCSS(theme, mode)], { type: 'text/css' })),
		rel = document.head.querySelector('link[rel=stylesheet]'), cssOld = rel.href;
	rel.href = cssNew;
	URL.revokeObjectURL(cssOld);
}
