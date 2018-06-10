import exportExternal from './export';

export default function () {
	return `
		${exportExternal.call(this.user)}
	`;
}
