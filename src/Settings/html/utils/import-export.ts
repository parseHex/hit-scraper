import { sectionTitle, input, descriptionTitle } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export/Import')}
				<p>
					<button id="sexport">
						Export
					</button>
				</p>
				<p>
					<button id="simport">
						Import
					</button>
				</p>
				${input('file', { id: 'fsimport', style: 'display:none;' })}
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Export')}
					Export your current settings, block list, and include list as a local file.
				</section>
				<section>
					${descriptionTitle('Import')}
					Import your settings, block list, and include list from a local file.
				</section>
				<div style="margin-top:10px" id="eisStatus"></div>
			</div>
		</div>
	`;
}
