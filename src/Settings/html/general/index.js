import exportButtons from "./export-buttons";
import bubbleNewHITs from "./bubble-new-hits";
import alertVolume from "./alert-volume";

export default function () {
	return `
		${exportButtons.apply(this)}
		${bubbleNewHITs.apply(this)}
		${alertVolume.apply(this)}
	`;
}
