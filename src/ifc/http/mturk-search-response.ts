export interface MTSearchResponse {
	num_results: number;
	page_number: number;
	results: MTSearchResult[];
	total_num_results: number;
}
export interface MTSearchResultRequirement {
	caller_meets_requirement: boolean;
	caller_qualification_value: MTSearchResultCallerQual;
	comparator: string;
	qualification_request_url: string;
	qualification_type: MTSearchResultQualType;
	qualification_type_id: string;
	qualification_values: string[];
	worker_action: string;
}

interface MTSearchResultQualType {
	description: string;
	has_test: boolean;
	is_requestable: boolean;
	keywords: string;
	name: string;
	qualification_type_id: string;
	visibility: boolean;
}
interface MTSearchResultLocale {
	country: any; // null
	subdivision: any; // null
}
interface MTSearchResultCallerQual {
	integer_value: any; // null
	locale_value: MTSearchResultLocale;
}
interface MTSearchResultMonetaryReward {
	amount_in_dollars: number;
	currency_code: string;
}
interface MTSearchResult {
	accept_project_task_url: string;
	assignable_hits_count: number;
	assignment_duration_in_seconds: number;
	caller_meets_preview_requirements: boolean;
	caller_meets_requirements: boolean;
	creation_time: string;
	description: string;
	hit_set_id: string;
	last_updated_time: string;
	latest_expiration_time: string;
	monetary_reward: MTSearchResultMonetaryReward;
	project_requirements: MTSearchResultRequirement[];
	project_tasks_url: string;
	requester_id: string;
	requester_name: string;
	requester_url: string;
	title: string;
}
