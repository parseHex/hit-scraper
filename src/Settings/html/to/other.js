import { label, input, descriptionTitle } from "../_dom";

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				<p>
					${label('Timeout', 'toTimeout')}
					${input('number', { id: 'toTimeout', name: 'toTimeout', min: 1, max: 60, value: user.toTimeout })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Timeout')}
					The max time (in seconds) to wait on a response from TO before giving up.
					<br />
					You might want a longer timeout (>15s) if you're using Async TO mode. &nbsp;
					Try out different values and see what works best for you.
				</section>
			</div>
		</div>
	`;
}
