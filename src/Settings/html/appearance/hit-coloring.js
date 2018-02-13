import { sectionTitle, label, input, descriptionTitle } from "../_dom";

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('HIT Coloring')}
				<p>
					${label('Link', 'link')}
					${input('radio', { id: 'link', name: 'hitColor', value: 'link', checked: user.hitColor === 'link' })}
				</p>
				<p>
					${label('Cell', 'cell')}
					${input('radio', { id: 'cell', name: 'hitColor', value: 'cell', checked: user.hitColor === 'cell' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Link')}
					Apply coloring based on Turkopticon reviews to all applicable links in the results table.
				</section>
				<section>
					${descriptionTitle('Cell')}
					Apply coloring based on Turkopticon reviews to the background of all &nbsp;
					applicable cells in the results table.
				</section>
			</div>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				The Classic theme is exempt from these settings and will always colorize cells.
			</p>
		</div>
	`;
}
