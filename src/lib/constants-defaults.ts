export const TO_BASE = 'https://turkopticon.ucsd.edu/';
export const TO_REPORTS = TO_BASE + 'reports?id=';
export const TO_API = TO_BASE + 'api/multi-attrs.php?ids=';

export const defaults = {
	vbTemplate: '[table][tr][td][b]Title:[/b] [URL=${previewLink}]${title}[/URL] ' +
		'| [URL=${pandaLink}]PANDA[/URL]\n' +
		'[b]Requester:[/b] [URL=${requesterLink}]${requesterName}[/URL] [${requesterId}] ' +
		'([URL=' + TO_REPORTS + '${requesterId}]TO[/URL])\n' +
		'[b]TO Ratings:[/b]\n${toVerbose}\n${toFoot}\n' +
		'[b]Description:[/b] ${description}\n[b]Time:[/b] ${time}\n[b]HITs Available:[/b] ${numHits}\n' +
		'[b]Reward:[/b] [COLOR=green][b]${reward}[/b][/COLOR]\n' +
		'[b]Qualifications:[/b] ${quals}[/td][/tr][/table]'
};
