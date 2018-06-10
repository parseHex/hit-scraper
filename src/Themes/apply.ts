import { Themes } from '.';

export default function (this: Themes, theme: string, mode?: string) {
	const cssNew = URL.createObjectURL(new Blob([this.generateCSS(theme, mode)], { type: 'text/css' }));
	const rel = <HTMLLinkElement>document.head.querySelector('link[rel=stylesheet]');
	const cssOld = rel.href;
	rel.href = cssNew;
	URL.revokeObjectURL(cssOld);
}
