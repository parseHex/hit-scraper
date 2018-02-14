import colorType from './color-type';
import sortType from './sort-type';
import toWeights from './to-weights';
import other from './other';

export default function () {
	return `
		${colorType.apply(this.user)}
		${sortType.apply(this.user)}
		${toWeights.apply(this.user)}
		${other.apply(this.user)}
	`;
}
