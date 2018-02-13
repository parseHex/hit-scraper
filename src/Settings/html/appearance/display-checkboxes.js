import { sectionTitle, input, descriptionTitle, label } from '../_dom';

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Display Checkboxes')}
				<p>
					${label('Show', 'checkshow')}
					${input('radio', { id: 'checkshow', name: 'checkbox', value: 'true', checked: user.showCheckboxes })}
				</p>
				<p>
					${label('Hide', 'checkhide')}
					${input('radio', { id: 'checkhide', name: 'checkbox', value: 'false', checked: !user.showCheckboxes })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Show')}
					Shows all checkboxes and radio inputs on the control panel for sake of clarity.
				</section>
				<section>
					${descriptionTitle('Hide')}
					Hides checkboxes and radio inputs for a cleaner, neater appearance. &nbsp;
					Their visibility is not required for proper operation; &nbsp;
					all options can still be toggled while hidden.
				</section>
			</div>
		</div>
	`;
}
