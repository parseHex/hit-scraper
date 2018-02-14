import { sectionTitle, descriptionTitle, label, input } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Additional Notifications')}
				<p>
					${label('Blink', 'notifyBlink')}
					${input('checkbox', { id: 'notifyBlink', name: 'notify', checked: this.notifyBlink })}
				</p>
				<p>
					${label('Taskbar', 'notifyTaskbar')}
					${input('checkbox', { id: 'notifyTaskbar', name: 'notify', checked: this.notifyTaskbar })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Blink')}
					Blink the tab when there are new HITs.
				</section>
				<section>
					${descriptionTitle('Taskbar')}
					Create an HTML5 browser notification when there are new HITs, &nbsp;
					which appears over the taskbar for 10 seconds.
				</section>
			</div>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				These notification options will only apply when the page does not have active focus.
			</p>
		</div>
	`;
}
