import exportButtons from './export-buttons';
import bubbleNewHITs from './bubble-new-hits';
import alertVolume from './alert-volume';
import tableColumns from './table-columns';

export default function () {
	return `
		${exportButtons.call(this.user)}
		${bubbleNewHITs.call(this.user)}
		${alertVolume.call(this.user)}
		${tableColumns.call(this.user)}
	`;
}
