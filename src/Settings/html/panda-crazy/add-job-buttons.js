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
			</div>
		</div>
	`;
}
