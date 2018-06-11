import * as ifc from '../../ifc';
import { TO_REPORTS } from '../../lib/constants';
import { cleanTemplate } from '../../lib/util';
import createTooltip from '../../lib/create-tooltip';
import { hidden } from '../../Interface/html/table';

import makeButton from './make-button';

export default function addRowHTML(
	hitRow: ifc.HITData,
	shouldHide: boolean,
	reviewsError: boolean,
	reviewsLoading: boolean,
	rowColor: string
) {
	const center = 'text-align:center;';

	let trClass = rowColor;
	if (hitRow.included) trClass += ' includelisted';
	if (shouldHide) trClass += ' ignored hidden';
	if (hitRow.blocked) trClass += ' blocklisted';
	if (hitRow.shine) trClass += ' shine';

	let pandaHref = '';
	if (hitRow.hit.panda) pandaHref = `href="${hitRow.hit.panda}"`;

	let requesterHref = '';
	if (hitRow.requester.id) requesterHref = `href="${TO_REPORTS}${hitRow.requester.id}"`;

	const expData = {
		gid: hitRow.groupId,
	};

	const titleTooltipData = {
		data: hitRow,
	};
	const toTooltipData = {
		error: reviewsError,
		loading: reviewsLoading,
		data: hitRow.TO,
	};

	return cleanTemplate(`
		<tr class="${trClass}">
			<td class="block-tc ${hidden('block', hitRow.blocked)}">
				<button name="block" value="${hitRow.requester.name}" class="block" title="Block this requester">
					R
				</button>
				<button name="block" value="${hitRow.title.replace(/"/g, '&quot;')}" class="block" title="Block this title">
					T
				</button>
				<button name="block" value="${hitRow.groupId}" class="block" title="Block this Group ID">
					ID
				</button>
			</td>
			<td class="requester-tc ${hidden('requester')}">
				<div>
					<a class="static" target="_blank" href="${hitRow.requester.link}">
						${hitRow.requester.name}
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
					<a target="_blank" class="static hit-title" href="${hitRow.hit.preview}">
						${hitRow.title + createTooltip(titleTooltipData)}
					</a>
				</div>
			</td>
			<td class="rewardpanda-tc" style="${center}">
				<a target="_blank" ${pandaHref}>
					${hitRow.pay}
				</a>
			</td>
			<td class="available-tc ${hidden('available')}" style="${center}">
				${hitRow.numHits}
			</td>
			<td class="duration-tc ${hidden('duration')}" style="${center}">
				${hitRow.timeStr}
			</td>
			<td class="topay-tc ${hidden('topay')}" style="${center}">
				<a class="static toLink" target="_blank" data-rid="${hitRow.requester.id || 'null'}" ${requesterHref}>
					${(hitRow.TO ? hitRow.TO.attrs.pay : 'n/a') + createTooltip(toTooltipData)}
				</a>
			</td>
			<td style="${center}" class="${hitRow.masters ? 'reqmaster' : 'nomaster'} masters-tc ${hidden('masters')}"">
				${hitRow.masters ? 'Y' : 'N'}
			</td>
			<td class="tooweak notqualified-tc ${hidden('notqualified', hitRow.qualified)}" title="Not qualified to work on this HIT">
				NQ
			</td>
		</tr>
	`);
}
