import { cleanTemplate } from "../lib/util";

const title = (t: string) => cleanTemplate(t, { titleMode: true });

export default {
	refresh: title(`Enter search refresh delay in seconds.
									Enter 0 for no auto-refresh.
									Default is 0 (no auto-refresh).`),
	pages: 'Enter number of pages to scrape. Default is 1.',
	skips: title(`Searches additional pages to get a more consistent number of results.
								Helpful if you're blocking a lot of items.`),
	resultsPerPage: 'Number of results to return per page (maximum is 100, default is 30)',
	batch: 'Enter minimum HITs for batch search (must be searching by Most Available).',
	gbatch: "Apply the 'Minimum batch size' filter to all search options.",
	reward: 'Enter the minimum desired pay per HIT (e.g. 0.10).',
	qual: "Only show HITs you're currently qualified for.",
	monly: 'Only show HITs that require Masters qualifications.',
	mhide: title(`Remove masters hits from the results if selected,
								otherwise display both masters and non-masters HITS.
								The 'qualified' setting supercedes this option.`),
	searchBy: title(`Get search results by...
								 	Latest = HIT Creation Date (newest first),
									Most Available = HITs Available (most first),
								 	Reward = Reward Amount (most first),
									Title = Title (A-Z)`),
	invert: title(`Reverse the order of the Search By choice, so...
								 Latest = HIT Creation Date (oldest first),
								 Most Available = HITs Available (least first),
								 Reward = Reward Amount (least first),
								 Title = Title (Z-A)`),
	shine: title(`Enter time (in seconds) to keep new HITs highlighted.
								Default is 300 (5 minutes).`),
	sound: 'Play a sound when new results are found.',
	soundSelect: 'Select which sound will be played.',
	minTOPay: title(`After getting search results, hide any results below this average Turkopticon pay rating.
									 Minimum is 1, maximum is 5, decimals up to 2 places, such as 3.25`),
	hideNoTO: 'After getting search results, hide any results that have no, or too few, Turkopticon pay ratings.',
	disableTO: title(`Disable attempts to download ratings data from Turkopticon for the results table.
										NOTE: TO is cached. That means if TO is availible from a previous scrape, &nbsp;
										it will use that value even if TO is disabled. &nbsp;
										This option only prevents the retrieval of ratings from the Turkopticon servers.`),
	sortPay: 'After getting search results, re-sort the results based on their average Turkopticon pay ratings.',
	sortAll: 'After getting search results, re-sort the results by their overall Turkopticon rating.',
	sortAsc: 'Sort results in ascending (low to high) order.',
	sortDsc: 'Sort results in descending (high to low) order.',
	search: 'Enter keywords to search for; default is blank (no search terms).',
	hideBlock: title(`When enabled, hide HITs that match your blocklist.
										When disabled, HITs that match your blocklist will be displayed with a red border.`),
	onlyIncludes: title(`Show only HITs that match your includelist.
											 Be sure to edit your includelist first or no results will be displayed.`),
	shineInc: 'Outline HITs that match your includelist with a dashed green border.',
	onlyViable: title(`Filters out HITs with qualifications you do not have and &nbsp;
										 can neither request nor take a test to obtain.
										 Does not work while logged out.`),
};
