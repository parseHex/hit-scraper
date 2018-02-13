import { cleanTemplate } from '../../lib/util'

export default function () {
	return cleanTemplate(`
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative; left:-8px">
					<b>Additional Notifications</b>
				</span>
				<br />
				<p>
					<label for="notifyBlink" style="float:left; width:51px">
						Blink
					</label>
					<input &nbsp;
						id="notifyBlink"
						type="checkbox"
						name="notify"
						${this.user.notifyBlink ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="notifyTaskbar" style="float:left; width:51px">
						Taskbar
					</label>
					<input &nbsp;
						id="notifyTaskbar"
						type="checkbox"
						name="notify"
						${this.user.notifyTaskbar ? 'checked' : ''}
					/>
				</p>
			</div>
			<section style="margin-left:160px">
				<span style="position:relative; left:10px">
					<i>blink</i>
				</span>
				<br />
				Blink the tab when there are new HITs.
			</section>
			<section style="margin-left:160px">
				<span style="position:relative; left:10px">
					<i>taskbar</i>
				</span>
				<br />
				Create an HTML5 browser notification when there are new HITs, &nbsp;
				which appears over the taskbar for 10 seconds.
			</section>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				These notification options will only apply when the page does not have active focus.
			</p>
		</div>
	`);
}
