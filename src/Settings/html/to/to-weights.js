import { sectionTitle, label, input } from '../_dom';

export default function () {
	const { user } = this;
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	const common = { name: 'TOW', min: 1, max: 10, step: 0.5 };

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('TO Weighting')}
				<p>
					${label('comm', 'comm')}
					${input('number', Object.assign(common, { id: 'comm', value: user.toWeights.comm }))}
				</p>
				<p>
					${label('pay', 'pay')}
					${input('number', Object.assign(common, { id: 'pay', value: user.toWeights.pay }))}
				</p>
				<p>
					${label('fair', 'fair')}
					${input('number', Object.assign(common, { id: 'fair', value: user.toWeights.fair }))}
				</p>
				<p>
					${label('fast', 'fast')}
					${input('number', Object.assign(common, { id: 'fast', value: user.toWeights.fast }))}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					Specify weights for TO attributes to place greater importance on certain attributes over others.
					<p>
						The default values, [1, 3, 3, 1], ensure consistency between HIT Scraper and &nbsp;
						<a style="color:black" href="${_ccs}" target="_blank">
							Color Coded Search
						</a> &nbsp;
						recommended values for adjusted coloring are [1, 6, 3.5, 1].
					</p>
				</section>
			</div>
		</div>
	`;
}
