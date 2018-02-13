import Settings from '../../Settings/index';

export default function () {
	return `
		<div id="results">
			<table id="resultsTable" style="width:100%">
				<caption style="font-weight:800;line-height:1.25em;font-size:1.5em;">
					HIT Scraper Results
				</caption>
				<thead>
					<tr style="font-weight:800;font-size:0.87em;text-align:center">
						<td class="block-tc ${hidden('block')}" style="width:52px">Block</td>
						<td class="requester-tc ${hidden('requester')}">
							Requester
						</td>
						<td class="title-tc">
							Title
						</td>
						<td class="rewardpanda-tc" style="width:70px">
							Reward &amp; PandA
						</td>
						<td class="available-tc ${hidden('available')}" style="width:35px">
							# Avail
						</td>
						<td class="duration-tc ${hidden('duration')}" style="width:47px">
							Time
						</td>
						<td class="topay-tc ${hidden('topay')}" style="width:30px">
							TO Pay
						</td>
						<td class="masters-tc ${hidden('masters')}" style="width:15px">
							M
						</td>
						<td class="notqualified-tc ${hidden('notqualified')}" style="width:15px"></td>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	`;
}

export function hidden(settingName, force) {
	if (force) return 'hidden';

	if (Settings.user[settingName + 'Column']) return '';
	return 'hidden';
}
