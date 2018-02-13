import displayCheckboxes from './display-checkboxes';
import themes from './themes';
import hitColoring from './hit-coloring';
import fontSize from './font-size';

export default function () {
	return `
		${displayCheckboxes.apply(this)}
		${themes.apply(this)}
		${hitColoring.apply(this)}
		${fontSize.apply(this)}
	`;
}
