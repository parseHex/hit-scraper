import importExport from "./import-export";

export default function () {
	return `
		${importExport.apply(this)}
	`;
}
