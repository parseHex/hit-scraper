import { DOC_TITLE } from '../lib/constants';

export default function () {
	if (this.blackhole.blink) clearInterval(this.blackhole.blink);
	document.title = DOC_TITLE;
}
