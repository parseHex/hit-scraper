import { cleanTemplate } from '../../lib/util';

export default function () {
	return cleanTemplate(`
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position relative; left:-8px">
					<b>Export/Import</b>
				</span>
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
				<input &nbsp;
					type="file"
					id="fsimport"
					style="display:none"
				/>
			</div>
			<section style="margin-left:130px; margin-top:15px">
				<span style="position:relative; left:10px">
					<i>Export</i>
				</span>
				<br />
				Export your current settings, block list, and include list as a local file.
			</section>
			<section style="margin-left:130px">
				<span style="position:relative; left:10px">
					<i>Import</i>
				</span>
				<br />
				Import your settings, block list, and include list from a local file.
			</section>
			<div style="margin-top:10px" id="eisStatus"></div>
		</div>
	`);
}
