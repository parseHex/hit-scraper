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
				<p>
					${label('Async', 'asyncTO')}
					${input('checkbox', { id: 'asyncTO', checked: user.asyncTO })}
				</p>
				<p>
					${label('Cache Reviews', 'cacheTO')}
					${input('checkbox', { id: 'cacheTO', checked: user.cacheTO })}
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
				<section>
					${descriptionTitle('Async')}
					When this option is enabled, Turkopticon reviews will be loaded in the background &nbsp;
					and won't delay searches.
					<br />
					Probably not a good idea to use this with short auto-refresh delay.
				</section>
				<section>
					${descriptionTitle('Cache Reviews')}
					When this option is enabled, Turkopticon reviews will be re-used when possible. &nbsp;
					For example, when a HIT shows up in the results more than once, its TO review &nbsp;
					data won't be refreshed and the old data will be used.
				</section>
			</div>
		</div>
	`;
}
