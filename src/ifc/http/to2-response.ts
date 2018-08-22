export interface TO2_response {
	status: number; // hopefully 200
	data: Requester[];
}

interface Requester {
	type: 'requesters';
	id: string; // requester id
	attributes: {
		// attributes can have other data but this is the data we care about
		aggregates: {
			all: ReviewData;
			recent: ReviewData;
		}
	}
}
interface ReviewData {
	reward: [number, number, number];
	pending: number;
	comm: [number, number, number];
	recommend: [number, number, number];
	rejected: [number, number, number];
	tos: [number, number];
	broken: [number, number];
}
