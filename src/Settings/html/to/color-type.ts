import { sectionTitle, descriptionTitle, label, input } from '../_dom';

export default function () {
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Color Type')}
				<p>
					${label('Simple', 'ctSim')}
					${input('radio', { id: 'ctSim', name: 'colorType', value: 'sim', checked: this.colorType === 'sim' })}
				</p>
				<p>
					${label('Adjusted', 'ctAdj')}
					${input('radio', { id: 'ctAdj', name: 'colorType', value: 'adj', checked: this.colorType === 'adj' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Simple')}
					HIT Scraper will use a simple weighted average to &nbsp;
					determine the overall TO rating and colorize results using that value. &nbsp;
					Use this setting to make coloring consistent between HIT Scraper and &nbsp;
					<a style="color:black" href="${_ccs}" target="_blank">
						Color Coded Search
					</a>.
				</section>
				<section>
					${descriptionTitle('Adjusted')}
					HIT Scraper will calculate a Bayesian adjusted average based on confidence &nbsp;
					of the TO rating to colorize results. &nbsp;
					Confidence is proportional to the number of reviews.
				</section>
			</div>
		</div>
	`;
}
