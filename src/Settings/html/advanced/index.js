import exportExternal from './export';

export default function () {
	return `
		${exportExternal.apply(this.user)}
	`;
}
