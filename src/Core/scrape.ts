import * as ifc from 'ifc';
import Settings from 'Settings';
import { ENV } from 'lib/constants';
import state from 'lib/state';
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';
import enums from 'lib/enums';
import { addHits } from 'api/search/listen';

import { Core } from './index';

export interface ScrapeInfo {
	page: number;
	nextPageURL: string;
	payload: ifc.MTSearchPayload;
	responseType: 'json';
}

const lang = new HumanizeDurationLanguage();
const h = new HumanizeDuration(lang);
const fixTime = h.humanize.bind(h);

export default function (this: Core, src: ifc.MTSearchResponse) {
	const addedHits: ifc.HITData[] = [];

	Object.keys(state.scraperHistory.cache).forEach(function (gid) {
		// set all hits to .current = false
		// (any hits in results will go back to .current = true below)
		state.scraperHistory.get(gid).current = false;
	});

	src.results.forEach((v, i) => {
		// url .json fix
		v.requester_url = v.requester_url.replace('.json', '');
		v.project_tasks_url = v.project_tasks_url.replace('.json', '');
		v.accept_project_task_url = v.accept_project_task_url.replace('.json', '');

		const data: ifc.HITData = {
			discovery: Date.now(),
			title: v.title,
			index: getIndex(src.page_number, i),
			requester: {
				name: v.requester_name,
				id: v.requester_id,
				link: ENV.ORIGIN + v.requester_url,
			},
			pay: '$' + v.monetary_reward.amount_in_dollars.toFixed(2),
			payRaw: v.monetary_reward.amount_in_dollars,
			time: v.assignment_duration_in_seconds,
			timeStr: fixTime(v.assignment_duration_in_seconds * 1000).replace(',', ''),
			desc: v.description,
			quals: v.project_requirements.length ? v.project_requirements.map(getQuals) : ['None'],
			hit: {
				preview: ENV.ORIGIN + v.project_tasks_url,
				panda: ENV.ORIGIN + v.accept_project_task_url,
			},
			groupId: v.hit_set_id,
			TO: null,
			masters: !!~v.project_requirements.findIndex((q) => {
				return q.qualification_type_id === '2F1QJWKUDD8XADTFD2Q0G6UTO95ALH';
			}),
			numHits: v.assignable_hits_count,
			blocked: false,
			included: false,
			current: true,
			ignored: false,
			qualified: v.caller_meets_requirements,
			viable: !~v.project_requirements.findIndex((q) => {
				return q.caller_meets_requirement === false && q.qualification_type.is_requestable === false;
			}),
			shine: false,
			isNew: true,
		};

		const listsxr = this.crossRef(data.requester.name, data.title, data.groupId); // checks block/include lists
		data.blocked = listsxr[0];
		data.included = listsxr[1];

		if (
			(
				Settings.user.searchBy === enums.searchBy.MOST_AVAILABLE &&
				Settings.user.batch > 1 &&
				+data.numHits < Settings.user.batch
			) || (
				Settings.user.gbatch &&
				Settings.user.batch > 1 &&
				+data.numHits < Settings.user.batch
			) ||
			Settings.user.onlyViable && !data.viable
		) return;

		addedHits.push(data);

		state.scraperHistory.set(data.groupId, data);
	}, this);

	addHits(addedHits);

	const info: ScrapeInfo = {
		page: src.page_number,
		nextPageURL: src.num_results < Settings.user.resultsPerPage ? null : 'https://worker.mturk.com/',
		payload: this.getPayload(src.page_number + 1),
		responseType: 'json',
	};
	this.afterScrape(info);
}
function getQuals(qual: ifc.MTSearchResultRequirement) {
	return `${qual.qualification_type.name} ${qual.comparator} ${qual.qualification_values.join()}`;
}
function getIndex(page: number, index: number) {
	// pad the index so that we don't get duplicates
	const indexPadded = ('00' + index).slice(-2);

	return +(page + indexPadded);
}
