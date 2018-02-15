import { sectionTitle, label, input, descriptionTitle } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Don\'t Auto-Refresh When Queue Not Empty')}
				<p>
					${label('Enable', 'pcQ')}
					${input('checkbox', { id: 'pcQueue', value: this.pcQueue })}
				</p>
				<p>
					${label('Minimum HITs', 'pcQMin')}
					${input('number', { id: 'pcQMin', name: 'pcQueueMin', min: 1, max: 35, value: this.pcQueueMin })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Enable')}
					When this is enabled, HIT Scraper will not auto-refresh while there are HITs in your &nbsp;
					<a href="https://worker.mturk.com/tasks" target="_blank">
						Queue
					</a>.
				</section>
				<section>
					${descriptionTitle('Minimum HITs')}
					If there are at least this many HITs in the Queue, don't search until there are less.
					<br />
					Set this to 1 to disable auto-refresh while you're working on any HITs.
					<br />
					Example: If you set this to 5 then HIT Scraper won't auto-refresh until you have 4 or less &nbsp;
					HITs accepted (i.e. in your Queue).
				</section>
			</div>
		</div>
	`;
}
