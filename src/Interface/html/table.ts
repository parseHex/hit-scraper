import Settings from 'Settings';

export default function () {
	return `
		<div id="results">
			<table id="resultsTable">
				<caption>
					HIT Scraper Results
				</caption>
				<thead>
					<tr>
						<td class="block-tc ${hidden('block')}">Block</td>
						<td class="requester-tc ${hidden('requester')}">
							Requester
						</td>
						<td class="title-tc">
							Title
						</td>
						<td class="rewardpanda-tc">
							Reward &amp; PandA
						</td>
						<td class="available-tc ${hidden('available')}">
							# Avail
						</td>
						<td class="duration-tc ${hidden('duration')}">
							Time
						</td>
						<td class="topay-tc ${hidden('topay')}">
							TO Pay
						</td>
						<td class="masters-tc ${hidden('masters')}">
							M
						</td>
						<td class="notqualified-tc ${hidden('notqualified')}"></td>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	`;
}

export function hidden(settingName: string, force?: boolean) {
	if (force) return 'hidden';

	if (<boolean>Settings.user[settingName + 'Column']) return '';
	return 'hidden';
}
