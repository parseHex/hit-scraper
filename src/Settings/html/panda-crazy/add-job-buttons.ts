import { sectionTitle, descriptionTitle, label, input } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Add Job Buttons')}
				<p>
					${label('Panda', 'exportPcp')}
					${input('checkbox', { id: 'exportPcp', name: 'export', value: 'pc-p', checked: this.exportPcp })}
				</p>
				<p>
					${label('Once', 'exportPco')}
					${input('checkbox', { id: 'exportPco', name: 'export', value: 'pc-o', checked: this.exportPco })}
				</p>
				<p>
					${label('Use Custom Title', 'exportPcCustomTitle')}
					${input('checkbox', { id: 'exportPcCustomTitle', checked: this.exportPcCustomTitle })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Panda')}
					Show a button in the results to add the HIT to Panda Crazy as a Panda job.
				</section>
				<section>
					${descriptionTitle('Once')}
					Show a button in the results to add the HIT to Panda Crazy as a Once job.
				</section>
				<section>
					${descriptionTitle('Use Custom Title')}
					When adding to Panda Crazy, use a custom (pre-defined) title for the HIT.
					<br />
					(<a href="https://github.com/parseHex/hit-scraper/wiki/Panda-Crazy-Custom-Title" target="_blank">
						Learn about Custom Titles
					</a>)
				</section>
			</div>
			<p>
				<a href="http://pandacrazy.allbyjohn.com/help/jobs/add-job" target="_blank">
					Learn about Panda Crazy's jobs
				</a>
			</p>
		</div>
	`;
}
