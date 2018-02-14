import { SETTINGS_KEY } from "../lib/constants";

export default function () {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.user));
}
