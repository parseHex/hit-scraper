import { sectionTitle, label, number } from "../_dom";

export default function () {
	const { user } = this;
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('TO Weighting')}
				<p>
					${label('comm', 'comm')}
					${number({ id: 'comm', name: 'TOW', min: 1, max: 10, step: 0.5, value: user.toWeights.comm })}
				</p>
				<p>
					${label('pay', 'pay')}
					${number({ id: 'pay', name: 'TOW', min: 1, max: 10, step: 0.5, value: user.toWeights.pay })}
				</p>
				<p>
					${label('fair', 'fair')}
					${number({ id: 'fair', name: 'TOW', min: 1, max: 10, step: 0.5, value: user.toWeights.fair })}
				</p>
				<p>
					${label('fast', 'fast')}
					${number({ id: 'fast', name: 'TOW', min: 1, max: 10, step: 0.5, value: user.toWeights.fast })}
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
