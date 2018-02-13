import { ENV } from '../lib/constants';
import Settings from '../Settings/index';
import state from '../lib/state';
import fixTime from '../lib/fix-time';
import enums from '../lib/enums';

export default function (src) {
	src.results.forEach((v, i) => {
		// url .json fix
		v.requester_url = v.requester_url.replace('.json', '');
		v.project_tasks_url = v.project_tasks_url.replace('.json', '');
		v.accept_project_task_url = v.accept_project_task_url.replace('.json', '');

		const data = {
			discovery: Date.now(),
			title: v.title,
			index: src.page_number + ('00' + i).slice(-2),
			requester: { name: v.requester_name, id: v.requester_id, link: ENV.ORIGIN + v.requester_url },
			pay: '$' + v.monetary_reward.amount_in_dollars.toFixed(2),
			payRaw: v.monetary_reward.amount_in_dollars,
			time: v.assignment_duration_in_seconds,
			timeStr: fixTime(v.assignment_duration_in_seconds * 1000).replace(',', ''),
			desc: v.description,
			quals: v.project_requirements.length ? v.project_requirements.map(getQuals) : ['None'],
			hit: { preview: ENV.ORIGIN + v.project_tasks_url, panda: ENV.ORIGIN + v.accept_project_task_url },
			groupId: v.hit_set_id,
			TO: null,
			masters: !!~v.project_requirements.findIndex(q => q.qualification_type_id === '2F1QJWKUDD8XADTFD2Q0G6UTO95ALH'),
			numHits: v.assignable_hits_count,
			blocked: false,
			included: false,
			current: true,
			qualified: v.caller_meets_requirements,
			viable: !~v.project_requirements.findIndex(q => q.caller_meets_requirement === false && q.qualification_type.is_requestable === false)
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

		state.scraperHistory.set(data.groupId, data);
	}, this);

	const dispatchObj = {
		method: 'next',
		page: src.page_number,
		nextPageURL: src.num_results < Settings.user.resultsPerPage ? null : '/',
		payload: this.getPayload(src.page_number + 1),
		responseType: 'json'
	};
	this.dispatch('control', dispatchObj);

	function getQuals(qual) {
		return `${qual.qualification_type.name} ${qual.comparator} ${qual.qualification_values.join()}`;
	}
}
