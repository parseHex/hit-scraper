import exportButtons from "./export-buttons";
import bubbleNewHITs from "./bubble-new-hits";
import alertVolume from "./alert-volume";
import tableColumns from "./table-columns";

export default function () {
	return `
		${exportButtons.apply(this)}
		${bubbleNewHITs.apply(this)}
		${alertVolume.apply(this)}
		${tableColumns.apply(this)}
	`;
}
