import { sectionTitle, label, input } from '../_dom';

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Bubble New HITs')}
				<p>
					${label('Enable', 'bubbleNew')}
					${input('checkbox', { id: 'bubbleNew', checked: user.bubbleNew })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					When this option is enabled, new HITs will always be placed at the top of the results table.
				</section>
			</div>
		</div>
	`;
}
