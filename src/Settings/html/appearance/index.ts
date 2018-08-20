import displayCheckboxes from './display-checkboxes';
import hitColoring from './hit-coloring';
import fontSize from './font-size';

export default function () {
	return `
		${displayCheckboxes.call(this.user)}
		${hitColoring.call(this.user)}
		${fontSize.call(this.user)}
	`;
}
