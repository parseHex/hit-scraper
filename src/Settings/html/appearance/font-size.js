import { sectionTitle, label, descriptionTitle, input } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Font Size')}
				<p>
					${label('Normal', 'fontSize')}
					${input('number', { id: 'fontSize', name: 'fontSize', min: 5, value: this.fontSize })}
				</p>
				<p>
					${label('New HIT Offset', 'shineOffset')}
					${input('number', { id: 'shineOffset', name: 'shineOffset', value: this.shineOffset })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Normal')}
					Change the font size (measured in px) for text in the results table. &nbsp;
					Default is 11px.
				</section>
				<section>
					${descriptionTitle('New HIT Offset')}
					Controls the font size of new HITs relative to the rest of the results. &nbsp;
					Default is 1px.
					<br />
					<i>Example:</i> &nbsp;
					With a font size of 11px and an offset of 1px, new HITs will be displayed at 12px.
				</section>
			</div>
		</div>
	`;
}
