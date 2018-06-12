export interface MTSearchPayload {
	filters: {
		search_term: string;
		qualified: boolean;
		masters: boolean;
		min_reward: number;
	};
	page_size: number;
	sort: string;
	page_number: number;
	format: 'json';
}
