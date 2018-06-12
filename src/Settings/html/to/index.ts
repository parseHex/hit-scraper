import colorType from './color-type';
import sortType from './sort-type';
import toWeights from './to-weights';
import other from './other';

export default function () {
	return `
		${colorType.call(this.user)}
		${sortType.call(this.user)}
		${toWeights.call(this.user)}
		${other.call(this.user)}
	`;
}
