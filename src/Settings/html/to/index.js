import colorType from './color-type';
import sortType from './sort-type';
import toWeights from './to-weights';
import experimental from './experimental';
import other from './other';

export default function () {
	return `
		${colorType.apply(this)}
		${sortType.apply(this)}
		${toWeights.apply(this)}
		${other.apply(this)}
		${experimental.apply(this)}
	`;
}
