import displayCheckboxes from './display-checkboxes';
import fontSize from './font-size';

export default function () {
	return `
		${displayCheckboxes.call(this.user)}
		${fontSize.call(this.user)}
	`;
}
