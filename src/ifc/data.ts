export type ListOfHITs = { [index: string]: HITData };
export type ListOfReviews = { [index: string]: ReviewData };

export interface HITData {
	groupId: string;
	title: string;
	requester: RequesterData;
	desc: string;
	time: number;
	timeStr: string;
	discovery: number;
	qualified: boolean;
	masters: boolean;
	numHits: number;
	TO: ReviewData;
	pay: string;
	payRaw: number;
	quals: string[];

	shine: boolean;
	current: boolean;
	blocked: boolean;
	ignored: boolean;
	included: boolean;
	index: number;
	viable: boolean;
	hit: URLObject;
}
export interface TOAttributes {
	// these are all numbers as strings since TO does that for some reason
	comm: string;
	fair: string;
	fast: string;
	pay: string;
	[index: string]: string;
}
export interface ReviewData {
	attrs: TOAttributes;
	name: string;
	reviews: number;
	tos_flags: number;
}

interface RequesterData {
	id: string;
	name: string;
	link: string;
}
interface URLObject {
	preview: string;
	panda: string;
}
