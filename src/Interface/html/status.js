export default `
	<div id="status">
		<p id="status-stopped">
			Stopped
		</p>
		<p id="status-processing" class="hidden">
			<b class="spinner"></b>
			Processing page: &nbsp;
			<span>1</span>
		</p>
		<p id="status-correcting-skips" class="hidden">
			Correcting for skips
		</p>
		<p id="status-retrieving-to" class="hidden">
			<b class="spinner"></b>
			Retrieving TO data
		</p>
		<p id="status-to-error" class="hidden">
			Error retrieving TO data. &nbsp;
			<button id="btnRetryTO">
				Retry
			</button>
		</p>
		<p id="status-scrape-complete" class="hidden">
			Scrape Complete: &nbsp;
			<span></span>
		</p>
		<p id="status-queue-wait" class="hidden">
			Queue not empty. Waiting to Auto-Refresh. &nbsp;
			<button id="btnRetryQueue">
				Retry
			</button>
		</p>
		<p id="status-scraping-again" class="hidden">
			Scraping again in &nbsp;
			<span>0</span>
			&nbsp; seconds
		</p>
	</div>
`;
