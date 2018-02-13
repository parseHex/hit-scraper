import { sectionTitle, label, input, descriptionTitle } from '../_dom';

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Experimental')}
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
	`
}
