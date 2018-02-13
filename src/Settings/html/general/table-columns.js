import { sectionTitle, label, input, descriptionTitle } from "../_dom";

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Results Table Columns')}
				<p>
					${label('Block', 'blockColumn')}
					${input('checkbox', { id: 'blockColumn', name: 'tableColumn', checked: user.blockColumn })}
				</p>
				<p>
					${label('Requester', 'requesterColumn')}
					${input('checkbox', { id: 'requesterColumn', name: 'tableColumn', checked: user.requesterColumn })}
				</p>
				<p>
					${label('# Avail', 'availableColumn')}
					${input('checkbox', { id: 'availableColumn', name: 'tableColumn', checked: user.availableColumn })}
				</p>
				<p>
					${label('Time', 'durationColumn')}
					${input('checkbox', { id: 'durationColumn', name: 'tableColumn', checked: user.durationColumn })}
				</p>
				<p>
					${label('TO Pay', 'topayColumn')}
					${input('checkbox', { id: 'topayColumn', name: 'tableColumn', checked: user.topayColumn })}
				</p>
				<p>
					${label('M', 'mastersColumn')}
					${input('checkbox', { id: 'mastersColumn', name: 'tableColumn', checked: user.mastersColumn })}
				</p>
				<p>
					${label('NQ', 'notqualifiedColumn')}
					${input('checkbox', { id: 'notqualifiedColumn', name: 'tableColumn', checked: user.notqualifiedColumn })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Block')}
					Buttons to block HIT by Requester, Title, ID
				</section>
				<section>
					${descriptionTitle('Requester')}
					Name of the HIT's requester
				</section>
				<section>
					${descriptionTitle('# Avail')}
					Number of available HITs in the group
				</section>
				<section>
					${descriptionTitle('Time')}
					The time allotted to complete the HIT
				</section>
				<section>
					${descriptionTitle('TO Pay')}
					The "pay" rating of the HIT's requester
				</section>
				<section>
					${descriptionTitle('M')}
					HIT requires Masters
				</section>
				<section>
					${descriptionTitle('NQ')}
					Not qualified for the HIT
				</section>
			</div>
		</div>
	`;
}
