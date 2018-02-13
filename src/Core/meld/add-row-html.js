import Settings from '../../Settings/index';
import { TO_REPORTS } from '../../lib/constants';
import { cleanTemplate } from '../../lib/util';
import createTooltip from '../../lib/create-tooltip';

import makeButton from './make-button';

export default function addRowHTML(hitRow, shouldHide, reviewsError) {
	let _rt = '';
	if (!hitRow.blocked) {
		_rt = cleanTemplate(`
			<div>
				<button name="block" value="${hitRow.requester.name}" class="block" title="Block this requester">
					R
				</button>
				<button name="block" value="${hitRow.title.replace(/"/g, '&quot;')}" class="block" title="Block this title">
					T
				</button>
				<button name="block" value="${hitRow.groupId}" class="block" title="Block this Group ID">
					ID
				</button>
			</div>
		`);
	}

	const center = 'text-align:center;';

	let trClass = hitRow.rowColor;
	if (hitRow.included) trClass += ' includelisted';
	if (shouldHide) trClass += ' ignored hidden';
	if (hitRow.blocked) trClass += ' blocklisted';
	if (hitRow.shine) trClass += ' shine';

	const previewTitle = `Description:  ${hitRow.desc.replace(/"/g, '&quot;')}\n\nQualifications:  ${hitRow.quals.join('; ')}`;

	let pandaHref = '';
	if (hitRow.hit.panda) pandaHref = `href="${hitRow.hit.panda}"`;

	let requesterHref = '';
	if (hitRow.requester.id) requesterHref = `href="${TO_REPORTS}${hitRow.requester.id}"`;

	let dbTd = '';
	if (false) { // HIT DB is no longer with us (RIP)
		dbTd = cleanTemplate(`
			<td &nbsp;
				style="${center} cursor:default;"
				class="db nohitDB"
				data-index="requester${hitRow.requester.id ? 'Id' : 'Name'}"
				data-value="${hitRow.requester[hitRow.requester.id ? 'id' : 'name']}"
				data-cmp-value="${hitRow.title}"
				data-cmp-index="title"
			>
				R
			</td>
			<td &nbsp;
				style="${center} cursor:default;"
				class="db nohitDB"
				data-index="title"
				data-value="${hitRow.title}"
				data-cmp-value="${hitRow.requester.name}"
				data-cmp-index="requesterName"
			>
				T
			</td>
		`);
	}

	let qualTd = '';
	if (!hitRow.qualified) qualTd = '<td class="tooweak" title="Not qualified to work on this HIT">NQ</td>';

	const expData = {
		gid: hitRow.groupId,
	};

	return cleanTemplate(`
		<tr class="${trClass}">
			<td>
				${_rt}
				<div>
					<a class="static" target="_blank" href="${hitRow.requester.link}">${hitRow.requester.name}</a>
				</div>
			</td>
			<td>
				<div>
					${makeButton('Vb', 'vB', 'vBulletin', expData)}
					${makeButton('Irc', 'IRC', 'IRC', expData)}
					${makeButton('Hwtf', 'HWTF', '/r/hitsworthturkingfor', expData)}
					${makeButton('Pcp', 'PC-P', 'Panda Crazy (Panda)', expData, 'PC Panda')}
					${makeButton('Pco', 'PC-O', 'Panda Crazy (Once)', expData, 'PC Once')}
				</div>
				<div>
					<a target="_blank" class="static hit-title" href="${hitRow.hit.preview}">
						${hitRow.title + createTooltip('hit', hitRow)}
					</a>
				</div>
			</td>
			<td style="${center}">
				<a target="_blank" ${pandaHref}>
					${hitRow.pay}
				</a>
			</td>
			<td style="${center}">
				${hitRow.numHits}
			</td>
			<td style="${center}">
				<a class="static toLink" target="_blank" data-rid="${hitRow.requester.id || 'null'}" ${requesterHref}>
					${(hitRow.TO ? hitRow.TO.attrs.pay : 'n/a') + createTooltip('to', reviewsError ? false : hitRow.TO)}
				</a>
			</td>
			<td style="${center}" class="${hitRow.masters ? 'reqmaster' : 'nomaster'}">
				${hitRow.masters ? 'Y' : 'N'}
			</td>
			${dbTd}
			${qualTd}
		</tr>
	`);
}
