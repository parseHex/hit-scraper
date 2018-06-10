import { sectionTitle, label, input, descriptionTitle } from '../_dom';

export default function () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export to External Script(s)')}
				<p>
					${label('Enable', 'exportExternal')}
					${input('checkbox', { id: 'exportExternal', checked: this.exportExternal })}
				</p>
				<p>
					${label('Ignore Blocked HITs', 'externalNoBlocked')}
					${input('checkbox', { id: 'externalNoBlocked', checked: this.externalNoBlocked })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Enable')}
					This is for script authors who would like HIT Scraper to intergrate &nbsp;
					with their scripts.
					<br />
					You do not need to enable this if you don't know what it does, but it &nbsp;
					won't break anything if you do.
				</section>
				<section>
					${descriptionTitle('Ignore Blocked HITs')}
					Will not export blocked HITs.
				</section>
			</div>
		</div>
	`;
}
