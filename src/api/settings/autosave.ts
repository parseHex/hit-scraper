import Settings from "Settings";

export function disableAutosave() {
	Settings.autosave = false;
}
export function enableAutosave() {
	Settings.autosave = true;
}
