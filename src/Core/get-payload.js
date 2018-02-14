import Settings from '../Settings/index';
import Interface from '../Interface/index';

export default function (page = 1) {
	const { user } = Settings;
	const payload = {
		legacy: {
			searchWords: user.search,
			minReward: user.pay,
			qualifiedFor: Interface.isLoggedout ? 'off' : (user.qual ? 'on' : 'off'),
			requiresMasterQual: user.monly ? 'on' : 'off',
			sortType: '',
			pageNumber: page,
			pageSize: user.resultsPerPage || 50
		},
		next: {
			filters: {
				search_term: user.search,
				qualified: user.qual,
				masters: user.monly,
				min_reward: user.pay
			},
			page_size: user.resultsPerPage || 50,
			sort: '',
			page_number: page,
			format: 'json'
		}
	};
	const sort = user.invert ? 'asc' : 'desc';
	switch (user.searchBy) {
		case 0:
			payload.legacy.sortType = `LastUpdatedTime:${+!user.invert}`;
			payload.next.sort = 'updated_' + sort;
			break;
		case 1:
			payload.legacy.sortType = `NumHITs:${+!user.invert}`;
			payload.next.sort = 'num_hits_' + sort;
			break;
		case 2:
			payload.legacy.sortType = `Reward:${+!user.invert}`;
			payload.next.sort = 'reward_' + sort;
			break;
		case 3:
			payload.legacy.sortType = `Title:${+user.invert}`;
			payload.next.sort = 'title_' + sort;
			break;
	}
	return payload;
};
