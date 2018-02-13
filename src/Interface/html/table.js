export default function () {
	return `
		<div id="results">
			<table id="resultsTable" style="width:100%">
				<caption style="font-weight:800;line-height:1.25em;font-size:1.5em;">
					HIT Scraper Results
				</caption>
				<thead>
					<tr style="font-weight:800;font-size:0.87em;text-align:center">
						<td id="requester-column">
							Requester
						</td>
						<td id="title-column">
							Title
						</td>
						<td id="rewardpanda-column" style="width:70px">
							Reward &amp; PandA
						</td>
						<td id="available-column" style="width:35px">
							# Avail
						</td>
						<td id="topay-column" style="width:30px">
							TO Pay
						</td>
						<td id="masters-column" style="width:15px">
							M
						</td>
						<td id="notqualified-column" style="width:15px"></td>
						<td id="hitdb-column" style="width:15px"></td>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	`;
}
