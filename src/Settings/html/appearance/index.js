import displayCheckboxes from './display-checkboxes';
import themes from './themes';
import hitColoring from './hit-coloring';
import fontSize from './font-size';

export default function () {
	return `
		${displayCheckboxes.apply(this.user)}
		${themes.apply(this.user)}
		${hitColoring.apply(this.user)}
		${fontSize.apply(this.user)}
	`;
}
