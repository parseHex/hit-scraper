import { sectionTitle, input, descriptionTitle, label } from '../_dom'

export default function () {
	const _hwtf = 'https://www.reddit.com/r/HITsWorthTurkingFor';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export Buttons')}
				<p>
					${label('vBulletin', 'exportVb')}
					${input('checkbox', { id: 'exportVb', name: 'export', value: 'vb', checked: this.exportVb })}
				</p>
				<p>
					${label('IRC', 'exportIrc')}
					${input('checkbox', { id: 'exportIrc', name: 'export', value: 'irc', checked: this.exportIrc })}
				</p>
				<p>
					${label('Reddit', 'exportHwtf')}
					${input('checkbox', { id: 'exportHwtf', name: 'export', value: 'hwtf', checked: this.exportHwtf })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('vBulletin')}
					Show a button in the results to export the specified HIT with vBulletin &nbsp;
					formatted text to share on forums.
				</section>
				<section>
					${descriptionTitle('IRC')}
					Show a button in the results to export the specified HIT streamlined for sharing on IRC.
				</section>
				<section>
					${descriptionTitle('Reddit')}
					Show a button in the results to export the specified HIT for sharing on Reddit, formatted to &nbsp;
					<a style="color:black" href="${_hwtf}" target="_blank">
						r/HITsWorthTurkingFor
					</a> standards.
				</section>
			</div>
		</div>
	`;
}
