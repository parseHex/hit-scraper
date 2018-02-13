import { sectionTitle, label, input, descriptionTitle } from "../_dom";

export default function () {
	const { user } = this;

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Sort Type')}
				<p>
					${label('Simple', 'stSim')}
					${input('radio', { id: 'stSim', name: 'sortType', value: 'sim', checked: user.sortType === 'sim' })}
				</p>
				<p>
					${label('Adjusted', 'stAdj')}
					${input('radio', { id: 'stAdj', name: 'sortType', value: 'adj', checked: user.sortType === 'adj' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Simple')}
					HIT Scraper will sort results based simply on value regardless of the number of reviews.
				</section>
				<section>
					${descriptionTitle('Adjusted')}
					HIT Scraper will use a Bayesian adjusted rating based on reliability &nbsp;
					(i.e. confidence) of the data. &nbsp;
					It factors in the number of reviews such that, for example, &nbsp;
					a requester with 100 reviews rated at 4.6 will rightfully be ranked higher &nbsp;
					than a requester with 3 reviews rated at 5. &nbsp;
					This gives a more accurate representation of the data.
				</section>
			</div>
		</div>
	`;
}
