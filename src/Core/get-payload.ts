import * as ifc from 'ifc';
import Settings from 'Settings';

export default function (page = 1) {
	const { user } = Settings;
	const payload: ifc.MTSearchPayload = {
		filters: {
			search_term: user.search,
			qualified: user.qual,
			masters: user.monly,
			min_reward: user.reward
		},
		page_size: user.resultsPerPage || 50,
		sort: '',
		page_number: page,
		format: 'json',
	};
	const sort = user.invert ? 'asc' : 'desc';
	switch (user.searchBy) {
		case 0:
			payload.sort = 'updated_' + sort;
			break;
		case 1:
			payload.sort = 'num_hits_' + sort;
			break;
		case 2:
			payload.sort = 'reward_' + sort;
			break;
		case 3:
			payload.sort = 'title_' + sort;
			break;
	}
	return payload;
};
