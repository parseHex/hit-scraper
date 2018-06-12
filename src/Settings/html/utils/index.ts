import importExport from './import-export';

export default function () {
	return `
		${importExport.call(this.user)}
	`;
}
