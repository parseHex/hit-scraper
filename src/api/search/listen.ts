import * as ifc from 'ifc';

type ListenHandler = (HITs: ifc.HITData[], eventType: 'add' | 'update') => void;

const handlers: ListenHandler[] = [];

export const HITs: ifc.HITData[] = [];
export function listenForHITs(handler: ListenHandler) {
	handlers.push(handler);
}

export function addHits(hits: ifc.HITData[]) {
	const added = [];
	for (let i = 0; i < hits.length; i++) {
		if (isDuplicate(hits[i], HITs)) {
			// skip
			continue;
		}
		added.push(hits[i]);
		HITs.push(hits[i]);
	}
	notify(added, 'add');
}
export function updateHits(hits: ifc.HITData[]) {
	const updated = [];
	for (let i = 0; i < hits.length; i++) {
		for (let k = 0; k < HITs.length; k++) {
			if (hits[i].groupId === HITs[k].groupId) {
				HITs[k] = hits[i];
				updated.push(hits[i]);
			}
		}
	}
	notify(updated, 'update');
}

function notify(hits: ifc.HITData[], eventType: 'add' | 'update') {
	for (let i = 0; i < handlers.length; i++) {
		if (handlers[i]) { // make sure the handler still exists
			handlers[i](hits, eventType);
		}
	}
}

function isDuplicate(hit: ifc.HITData, arr: ifc.HITData[]) {
	for (let i = 0; i < arr.length; i++) {
		if (hit.groupId === arr[i].groupId) return true;
	}
	return false;
}
