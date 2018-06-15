import * as ifc from '../../ifc';
import { TO_REPORTS } from '../../lib/constants';
import { cleanTemplate } from '../../lib/util';
import createTooltip from '../../lib/create-tooltip';
import { hidden } from '../../Interface/html/table';

import makeButton from './make-button';

export default function addRowHTML(
	hit: ifc.HITData,
	shouldHide: boolean,
	reviewsError: boolean,
	reviewsLoading: boolean,
	rowColor: string
) {
	const center = 'text-align:center;';

	let trClass = rowColor;
	if (hit.included) trClass += ' includelisted';
	if (shouldHide) trClass += ' ignored hidden';
	if (hit.blocked) trClass += ' blocklisted';
	if (hit.shine) trClass += ' shine';

	let pandaHref = '';
	if (hit.hit.panda) pandaHref = `href="${hit.hit.panda}"`;

	let requesterHref = '';
	if (hit.requester.id) requesterHref = `href="${TO_REPORTS}${hit.requester.id}"`;

	const expData = {
		gid: hit.groupId,
	};

	const titleTooltipData = {
		data: hit,
	};
	const toTooltipData = {
		error: reviewsError,
		loading: reviewsLoading,
		data: hit.TO,
	};

	return cleanTemplate(`
		<tr class="${trClass}" data-HITdata="${encodeURIComponent(JSON.stringify(hit))}">
			<td class="block-tc ${hidden('block', hit.blocked)}">
				<button name="block" value="${hit.requester.name}" class="block" title="Block this requester">
					R
				</button>
				<button name="block" value="${hit.title.replace(/"/g, '&quot;')}" class="block" title="Block this title">
					T
				</button>
				<button name="block" value="${hit.groupId}" class="block" title="Block this Group ID">
					ID
				</button>
			</td>
			<td class="requester-tc ${hidden('requester')}">
				<div>
					<a class="static" target="_blank" href="${hit.requester.link}">
						${hit.requester.name}
					</a>
				</div>
			</td>
			<td class="title-tc">
				<div>
					${makeButton('Vb', 'vB', 'vBulletin', expData)}
					${makeButton('Irc', 'IRC', 'IRC', expData)}
					${makeButton('Hwtf', 'HWTF', '/r/hitsworthturkingfor', expData)}
					${makeButton('Pcp', 'PC-P', 'Panda Crazy (Panda)', expData, 'PC Panda')}
					${makeButton('Pco', 'PC-O', 'Panda Crazy (Once)', expData, 'PC Once')}
				</div>
				<div>
					<a target="_blank" class="static hit-title" href="${hit.hit.preview}">
						${hit.title + createTooltip(titleTooltipData)}
					</a>
				</div>
			</td>
			<td class="rewardpanda-tc" style="${center}">
				<a target="_blank" ${pandaHref}>
					${hit.pay}
				</a>
			</td>
			<td class="available-tc ${hidden('available')}" style="${center}">
				${hit.numHits}
			</td>
			<td class="duration-tc ${hidden('duration')}" style="${center}">
				${hit.timeStr}
			</td>
			<td class="topay-tc ${hidden('topay')}" style="${center}">
				<a class="static toLink" target="_blank" data-rid="${hit.requester.id || 'null'}" ${requesterHref}>
					${(hit.TO ? hit.TO.attrs.pay : 'n/a') + createTooltip(toTooltipData)}
				</a>
			</td>
			<td style="${center}" class="${hit.masters ? 'reqmaster' : 'nomaster'} masters-tc ${hidden('masters')}"">
				${hit.masters ? 'Y' : 'N'}
			</td>
			<td class="tooweak notqualified-tc ${hidden('notqualified', hit.qualified)}" title="Not qualified to work on this HIT">
				NQ
			</td>
		</tr>
	`);
}
