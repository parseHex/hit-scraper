import { sectionTitle, input, descriptionTitle, label } from '../_dom'

export default function () {
	const { user } = this;
	const _hwtf = 'https://www.reddit.com/r/HITsWorthTurkingFor';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export Buttons')}
				<p>
					${label('vBulletin', 'exportVb')}
					${input('checkbox', { id: 'exportVb', name: 'export', value: 'vb', checked: user.exportVb })}
				</p>
				<p>
					${label('IRC', 'exportIrc')}
					${input('checkbox', { id: 'exportIrc', name: 'export', value: 'irc', checked: user.exportIrc })}
				</p>
				<p>
					${label('Reddit', 'exportHwtf')}
					${input('checkbox', { id: 'exportHwtf', name: 'export', value: 'hwtf', checked: user.exportHwtf })}
				</p>
				<p>
					${label('Panda Crazy - Panda', 'exportPcp')}
					${input('checkbox', { id: 'exportPcp', name: 'export', value: 'pc-p', checked: user.exportPcp })}
				</p>
				<p>
					${label('Panda Crazy - Once', 'exportPco')}
					${input('checkbox', { id: 'exportPco', name: 'export', value: 'pc-o', checked: user.exportPco })}
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
				<section>
					${descriptionTitle('Panda Crazy - Panda')}
					Show a button in the results to export the specified HIT to Panda Crazy's Panda queue.
				</section>
				<section>
					${descriptionTitle('Panda Crazy - Once')}
					Show a button in the results to export the specified HIT to Panda Crazy's Once queue.
				</section>
			</div>
		</div>
	`;
}
