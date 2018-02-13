// import { ENV } from '../lib/constants';

export default {
	refresh: 'Enter search refresh delay in seconds.\nEnter 0 for no auto-refresh.\nDefault is 0 (no auto-refresh).',
	pages: 'Enter number of pages to scrape. Default is 1.',
	skips: 'Searches additional pages to get a more consistent number of results. Helpful if you\'re blocking a lot of items.',
	resultsPerPage: 'Number of results to return per page (maximum is 100, default is 30)',
	batch: 'Enter minimum HITs for batch search (must be searching by Most Available).',
	pay: 'Enter the minimum desired pay per HIT (e.g. 0.10).',
	qual: 'Only show HITs you\'re currently qualified for (must be logged in).',
	monly: 'Only show HITs that require Masters qualifications.',
	mhide: 'Remove masters hits from the results if selected, otherwise display both masters and non-masters HITS.\n' +
		'The \'qualified\' setting supercedes this option.',
	searchBy: 'Get search results by...\n Latest = HIT Creation Date (newest first),\n ' +
		'Most Available = HITs Available (most first),\n Reward = Reward Amount (most first),\n Title = Title (A-Z)',
	invert: 'Reverse the order of the Search By choice, so...\n Latest = HIT Creation Date (oldest first),\n ' +
		'Most Available = HITs Available (least first),\n Reward = Reward Amount (least first),\n Title = Title (Z-A)',
	shine: 'Enter time (in seconds) to keep new HITs highlighted.\nDefault is 300 (5 minutes).',
	sound: 'Play a sound when new results are found.',
	soundSelect: 'Select which sound will be played.',
	minTOPay: 'After getting search results, hide any results below this average Turkopticon pay rating.\n' +
		'Minimum is 1, maximum is 5, decimals up to 2 places, such as 3.25',
	hideNoTO: 'After getting search results, hide any results that have no, or too few, Turkopticon pay ratings.',
	disableTO: 'Disable attempts to download ratings data from Turkopticon for the results table.\n' +
		'NOTE: TO is cached. That means if TO is availible from a previous scrape, it will use that value even if ' +
		'TO is disabled. This option only prevents the retrieval of ratings from the Turkopticon servers,',
	sortPay: 'After getting search results, re-sort the results based on their average Turkopticon pay ratings.',
	sortAll: 'After getting search results, re-sort the results by their overall Turkopticon rating.',
	sortAsc: 'Sort results in ascending (low to high) order.',
	sortDsc: 'Sort results in descending (high to low) order.',
	search: 'Enter keywords to search for; default is blank (no search terms).',
	hideBlock: 'When enabled, hide HITs that match your blocklist.\n' +
		'When disabled, HITs that match your blocklist will be displayed with a red border.',
	onlyIncludes: 'Show only HITs that match your includelist.\nBe sure to edit your includelist first or no results will be displayed.',
	shineInc: 'Outline HITs that match your includelist with a dashed green border.',
	// mainlink: 'Version: ' + ENV.VERSION + '\nRead the documentation for HIT Scraper With Export on its Greasyfork page.',
	gbatch: 'Apply the \'Minimum batch size\' filter to all search options.',
	onlyViable: 'Filters out HITs with qualifications you do not have and \ncan neither request nor take a test to obtain.\n' +
		'Does not work while logged out.'
};
