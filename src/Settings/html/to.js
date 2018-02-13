import { cleanTemplate } from '../../lib/util';
import { secTitle, desc } from './main';

export default function () {
	const _hwtf = 'https://www.reddit.com/r/HITsWorthTurkingFor';
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	const colorTypeDesc = desc([
		{
			title: 'Simple',
			content: `HIT Scraper will use a simple weighted average to &nbsp;
				determine the overall TO rating and colorize results using that value. &nbsp;
				Use this setting to make coloring consistent between HIT Scraper and &nbsp;
				<a style="color:black" href="${_ccs}" target="_blank">
					Color Coded Search
				</a>.`,
		},
		{
			title: 'Adjusted',
			content: `HIT Scraper will calculate a Bayesian adjusted average based on confidence &nbsp;
				of the TO rating to colorize results. &nbsp;
				Confidence is proportional to the number of reviews.`,
		},
	]);
	const sortTypeDesc = desc([
		{
			title: 'Simple',
			content: `HIT Scraper will sort results based simply on value regardless of the number of reviews.`,
		},
		{
			title: 'Adjusted',
			content: `HIT Scraper will use a Bayesian adjusted rating based on reliability &nbsp;
				(i.e. confidence) of the data. &nbsp;
				It factors in the number of reviews such that, for example, &nbsp;
				a requester with 100 reviews rated at 4.6 will rightfully be ranked higher &nbsp;
				than a requester with 3 reviews rated at 5. &nbsp;
				This gives a more accurate representation of the data.`,
		},
	]);
	const toWeightsDesc = desc([
		{
			content: `
				Specify weights for TO attributes to place greater importance on certain attributes over others.
				<p>
					The default values, [1, 3, 3, 1], ensure consistency between HIT Scraper and &nbsp;
					<a style="color:black" href="${_ccs}" target="_blank">
						Color Coded Search
					</a> &nbsp;
					recommended values for adjusted coloring are [1, 6, 3.5, 1].
				</p>`,
		}
	])
	const experimentalDesc = desc([
		{
			title: 'Async TO (experimental)',
			content: `
				When this option is enabled, Turkopticon reviews will be loaded in the background &nbsp;
				and won't delay searches.
				<br />
				Probably not a good idea to use this with short auto-refresh delay.`,
		},
		{
			title: 'Cache TO Reviews (experimental)',
			content: `When this option is enabled, Turkopticon reviews will be re-used when possible. &nbsp;
				For example, when a HIT shows up in the results more than once, its TO review &nbsp;
				data won't be refreshed and the old data will be used.`,
		},
	]);

	return cleanTemplate(`
		<div class="row">
			<div class="column opts">
				${secTitle('Color Type')}
				<p>
					<label for="ctSim">
						Simple
					</label>
					<input &nbsp;
						id="ctSim"
						type="radio"
						name="colorType"
						value="sim"
						${this.user.colorType === 'sim' ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="ctAdj">
						Adjusted
					</label>
					<input &nbsp;
						id="ctAdj"
						type="radio"
						name="colorType"
						value="adj"
						${this.user.colorType === 'adj' ? 'checked' : ''}
					/>
				</p>
			</div>
			${colorTypeDesc}
		</div>
		<div class="row">
			<div class="column opts">
				${secTitle('Sort Type')}
				<p>
					<label for="stSim">
						Simple
					</label>
					<input &nbsp;
						id="stSim"
						type="radio"
						name="sortType"
						value="sim"
						${this.user.sortType === 'sim' ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="stAdj">
						Adjusted
					</label>
					<input &nbsp;
						id="stAdj"
						type="radio"
						name="sortType"
						value="adj"
						${this.user.sortType === 'adj' ? 'checked' : ''}
					/>
				</p>
			</div>
			${sortTypeDesc}
		</div>
		<div class="row">
			<div class="column opts">
				${secTitle('TO Weighting')}
				<p>
					<label for="comm">
						comm
					</label>
					<input &nbsp;
						id="comm"
						type="number"
						name="TOW"
						min="1"
						max="10"
						step="0.5"
						value="${this.user.toWeights.comm}"
						style="width:40px"
					/>
				</p>
				<p>
					<label for="pay">
						pay
					</label>
					<input &nbsp;
						id="pay"
						type="number"
						name="TOW"
						min="1"
						max="10"
						step="0.5"
						value="${this.user.toWeights.pay}"
						style="width:40px"
					/>
				</p>
				<p>
					<label for="fair">
						fair
					</label>
					<input &nbsp;
						id="fair"
						type="number"
						name="TOW"
						min="1"
						max="10"
						step="0.5"
						value="${this.user.toWeights.fair}"
						style="width:40px"
					/>
				</p>
				<p>
					<label for="fast">
						fast
					</label>
					<input &nbsp;
						id="fast"
						type="number"
						name="TOW"
						min="1"
						max="10"
						step="0.5"
						value="${this.user.toWeights.fast}"
						style="width:40px"
					/>
				</p>
			</div>
			${toWeightsDesc}
		</div>
		<div class="row">
			<div class="column opts">
				${secTitle('Experimental Options')}
				<p>
					<label for="asyncTO">
						Async TO
					</label>
					<input &nbsp;
						id="asyncTO"
						type="checkbox"
						${this.user.asyncTO ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="cacheTO">
						Cache TO Reviews
					</label>
					<input &nbsp;
						id="cacheTO"
						type="checkbox"
						${this.user.cacheTO ? 'checked' : ''}
					/>
				</p>
			</div>
			${experimentalDesc}
		</div>
	`);
}
