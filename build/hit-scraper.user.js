// ==UserScript==
// @name        HIT Scraper
// @author      feihtality, parseHex
// @description Snag HITs. mturk.
// @namespace   https://greasyfork.org/users/8394
// @include     /^https://w(ww|orker).mturk.com/.*hit[-_]?scraper$/
// @version     4.4.0
// @grant       none
// ==/UserScript==

var hit_scraper = (function () {
'use strict';

// helpers
function on(target, type, handler) {
	target.addEventListener(type, handler);
}

function delegate(target, selector, type, handler) {
	function dispatcher(event) {
		const targets = target.querySelectorAll(selector);
		let i = targets.length;

		while (i--) {
			if (event.target === targets[i]) {
				handler(event);
				break;
			}
		}
	}

	on(target, type, dispatcher);
}

Object.entries = Object.entries || function (obj) {
	const props = Object.keys(obj);
	let i = props.length;
	const objArray = new Array(i);
	while (i--) objArray[i] = [props[i], obj[props[i]]];
	return objArray;
};

function cleanTemplate(str, opts = {}) {
	str = str.trim(); // remove whitespace from beginning and end
	str = str.replace(/^[\t ]+/gm, ''); // remove indents
	if (!opts.ignoreNewline) {
		str = str.replace(/\n/g, '').replace(/\r/g, ''); // remove newlines
	}
	str = str.replace(/&nbsp;/g, ''); // remove &nbsp; (helps to add spaces to end of lines)

	return str;
}
function pad(width, n, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const ENV = Object.freeze({
	LEGACY: 'www.mturk.com',
	NEXT: 'worker.mturk.com',
	HOST: window.location.hostname,
	ORIGIN: window.location.origin,
	ISFF: Boolean(window.sidebar),
	VERSION: '4.2.1',
});
const INCLUDE_KEY = 'new_scraper_scraper_include_list';
const IGNORE_KEY = 'new_scraper_scraper_ignore_list';
const SETTINGS_KEY = 'new_scraper_settings';


const DOC_TITLE = 'HIT Scraper';
const TO_BASE = 'https://turkopticon.ucsd.edu/';
const TO_REPORTS = TO_BASE + 'reports?id=';
const TO_API = TO_BASE + 'api/multi-attrs.php?ids=';

const ico = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsTDwctGwJAtQAAAYRJREFUOMudkz1rWmEUx3/6gFeC1A5p6RJByGTGTpEM3iHfwMmxfggH1yyB69BFyFAy5FIQ6wdw9CVxUOhQXFykYFcTLvEaiuafQU0wXoPkwIHnOS8/znPOeWAh18AU0I7qA61lLjfbAl3X1Ww2k+u620AtgP9BTsdx1O/3lUqlNBgM5DhOEGAaWh7eLeEgYywWo1QqMRwO8X2fdrtNsVjcCtkorVKpSJKy2awsy1Imk1Gv19vWh02j53mSpHQ6vctENo2dTkcrGY/HqlarSiaTuwMSiYRqtZomk8kzqNvt7g5YqTFGtm1LkjzPC4wJnEKz2cS2bSKRCMYYAOr1+htTCFtr1EKhoEajId/3NRqNVC6XFY/HF/69LyKfE9bivlikfA72D+H8DHh8e3PyOfAMfJjDj58YoMjvP4bQPVz9g4MU7Ifh7y2EDJgoHB/BqQ3fLuDzAdz14fIXaP6w+okvT8jnRFub+r0mTr6+bmJzVVgLmKw5w1ER/SQiH4O6fw80AJ4AC20qRDxx28IAAAAASUVORK5CYII=';
const audio0 = 'T2dnUwACAAAAAAAAAAB8mpoRAAAAAFLKt9gBHgF2b3JiaXMAAAAAARErAAAAAAAAkGUAAAAAAACZAU9nZ1MAAAAAAAAAAAAAfJqaEQEAAACHYsq6Cy3///////////+1A3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDA1MDMwNAAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABAgkAAAAAAAAfJqaEQIAAAB89IOyJjhEQUNNRE5TRENHS0xTRllHSEpISUdORk1GSEdISUNHP0ZHS1IhquPYHv5OAgC/7wFATp2pUBdX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';
/*'*/
const audio1 = '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VVVVVVVVVVVVVQBqs0jMnBWmgKng1FRU32lmZmb+N6/V+w+MygnAXTBSU3/Ffjw4KGwvhYijgbg038TRQL8U3//xv5cO4FZf/z8bdj8V3CpuILkwNl5P8KE+53G3eCoQUAIQxdpeAGCps5MdqtGpNehUFBQFS2qx1bDEzNSDATAKKlIBjsJGEQBFZnmMUrStzKW+pXKVDOZ+hnQ2jloarUNK2iGVjPlUVcHRF4NCI9e2HcNCJ4NQ0eEQlnbmh0FYaUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kkScD/K0GL+QyBnCYEgHsjBlXAAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';

const defaults = {
	themes: {
		whisper: {
			highlight: '#1F3847',
			background: '#232A2F',
			accent: '#00ffff',
			bodytable: '#AFCCDE',
			cpBackground: '#394752',
			toHigh: '#009DFF',
			toGood: '#40B6FF',
			toAverage: '#7ACCFF',
			toLow: '#B5E3FF',
			toPoor: '#DEF1FC',
			hitDB: '#CADA95',
			nohitDB: '#DA95A8',
			unqualified: '#808080',
			reqmaster: '#C1E1F6',
			nomaster: '#D6C1F6',
			defaultText: '#AFCCDE',
			inputText: '#98D6D6',
			secondText: '#808080',
			link: '#003759',
			vlink: '#40F0F0',
			toNone: '#AFCCDE',
			export: '#86939C',
			hover: '#1E303B'
		},
		solDark: {
			highlight: '#657b83',
			background: '#002b36',
			accent: '#b58900',
			bodytable: '#839496',
			cpBackground: '#073642',
			toHigh: '#859900',
			toGood: '#A2BA00',
			toAverage: '#b58900',
			toLow: '#cb4b16',
			toPoor: '#dc322f',
			hitDB: '#82D336',
			nohitDB: '#D33682',
			unqualified: '#9F9F9F',
			reqmaster: '#B58900',
			nomaster: '#839496',
			defaultText: '#839496',
			inputText: '#eee8d5',
			secondText: '#93a1a1',
			link: '#000000',
			vlink: '#6c71c4',
			toNone: '#839496',
			export: '#CCC6B4',
			hover: '#122A30'
		},
		solLight: {
			highlight: '#657b83',
			background: '#fdf6e3',
			accent: '#b58900',
			bodytable: '#657b83',
			cpBackground: '#eee8d5',
			toHigh: '#859900',
			toGood: '#A2BA00',
			toAverage: '#b58900',
			toLow: '#cb4b16',
			toPoor: '#dc322f',
			hitDB: '#82D336',
			nohitDB: '#36D0D3',
			unqualified: '#9F9F9F',
			reqmaster: '#B58900',
			nomaster: '#6C71C4',
			defaultText: '#657b83',
			inputText: '#6FA3A3',
			secondText: '#A6BABA',
			link: '#000000',
			vlink: '#6c71c4',
			toNone: '#657b83',
			export: '#000000',
			hover: '#C7D2D6'
		},
		classic: {
			highlight: '#30302F',
			background: '#131313',
			accent: '#94704D',
			bodytable: '#000000',
			cpBackground: '#131313',
			toHigh: '#66CC66',
			toGood: '#ADFF2F',
			toAverage: '#FFD700',
			toLow: '#FF9900',
			toPoor: '#FF3030',
			hitDB: '#66CC66',
			nohitDB: '#FF3030',
			unqualified: '#9F9F9F',
			reqmaster: '#551A8B',
			nomaster: '#0066CC',
			defaultText: '#94704D',
			inputText: '#000000',
			secondText: '#997553',
			link: '#0000FF',
			vlink: '#800080',
			toNone: '#d3d3d3',
			export: '#000000',
			hover: '#21211F'
		},
		deluge: {
			highlight: '#1F3847',
			background: '#434e56',
			accent: '#fbde2d',
			bodytable: '#f8f8f8',
			cpBackground: '#384147',
			toHigh: '#6FFA3C',
			toGood: '#D9FC35',
			toAverage: '#fbde2d',
			toLow: '#FAB050',
			toPoor: '#FA6F50',
			hitDB: '#d8fa3c',
			nohitDB: '#DA95A8',
			unqualified: '#ADC6EE',
			reqmaster: '#BFADEE',
			nomaster: '#ADEEDF',
			defaultText: '#f8f8f8',
			inputText: '#D8FA3C',
			secondText: '#ADC6EE',
			link: '#99004F',
			vlink: '#DCEEAD',
			toNone: '#97A167',
			export: '#ADC6EE',
			hover: '#426075'
		}
	},
	vbTemplate: '[table][tr][td][b]Title:[/b] [URL=${previewLink}]${title}[/URL] | [URL=${pandaLink}]PANDA[/URL]\n' +
		'[b]Requester:[/b] [URL=${requesterLink}]${requesterName}[/URL] [${requesterId}] ' +
		'([URL=' + TO_REPORTS + '${requesterId}]TO[/URL])\n' +
		'[b]TO Ratings:[/b]\n${toVerbose}\n${toFoot}\n' +
		'[b]Description:[/b] ${description}\n[b]Time:[/b] ${time}\n[b]HITs Available:[/b] ${numHits}\n' +
		'[b]Reward:[/b] [COLOR=green][b]${reward}[/b][/COLOR]\n' +
		'[b]Qualifications:[/b] ${quals}[/td][/tr][/table]'
};

const kb = { ESC: 27, ENTER: 13 };

var defaults$1 = {
	themes: { name: 'classic', colors: defaults.themes },

	colorType: 'sim',
	sortType: 'adj',
	toWeights: { comm: 1, pay: 3, fair: 3, fast: 1 },
	asyncTO: false,
	cacheTO: false,
	toTimeout: 6,

	exportVb: true,
	exportIrc: true,
	exportHwtf: true,
	exportPcp: false,
	exportPco: false,
	notifySound: [false, 'ding'],
	notifyBlink: false,
	notifyTaskbar: false,
	volume: { ding: 1, squee: 1 },
	wildblocks: true,
	showCheckboxes: true,
	hitColor: 'link',
	fontSize: 11,
	shineOffset: 1,

	blockColumn: true,
	requesterColumn: true,
	availableColumn: true,
	durationColumn: false,
	topayColumn: true,
	mastersColumn: true,
	notqualifiedColumn: true,

	pcQueue: false,
	pcQueueMin: 1,

	refresh: 0,
	pages: 1,
	skips: false,
	resultsPerPage: 50,
	batch: 0,
	reward: 0,
	qual: true,
	monly: false,
	mhide: false,
	searchBy: 0,
	invert: false,
	shine: 300,
	minTOPay: 0,
	hideNoTO: false,
	onlyViable: false,
	disableTO: false,
	sortPay: false,
	sortAll: false,
	search: '',
	hideBlock: true,
	onlyIncludes: false,
	shineInc: true,
	sortAsc: false,
	sortDsc: true,
	gbatch: false,
	bubbleNew: false,
	hidePanel: false,

	vbTemplate: defaults.vbTemplate,
	vbSym: '\u2605' // star
}

function save () {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.user));
}

function sectionTitle(text) {
	return `<span class="sec-title">${text}</span>`;
}
function descriptionTitle(text) {
	return `<span class="dsc-title">${text}</span>`;
}

function label(text, htmlFor) {
	if (htmlFor) htmlFor = `for="${htmlFor}"`;

	return `<label ${htmlFor}>${text}</label>`;
}

function select(options, value) {
	let html = '<select>';

	options.forEach(function (opt) {
		let selected = '';
		if (opt.value === value) selected = 'selected';

		html += `
			<option value="${opt.value}" ${selected}>
				${opt.text}
			</option>
		`;
	});

	html += '</select>';

	return html;
}

function input(type, opts) {
	return cleanTemplate(`
		<input &nbsp;
			type="${type}"
			${parseAttr(opts)}
		/>
	`);
}


function parseAttr(attrs) {
	let returnAttr = '';
	Object.keys(attrs).forEach(function (key) {
		if (attrs[key] === false) return;

		let val = '';
		if (attrs[key] !== true) val = `="${attrs[key]}"`;

		returnAttr += ` ${key}${val}`;
	});
	return returnAttr;
}

function exportButtons () {
	const _hwtf = 'https://www.reddit.com/r/HITsWorthTurkingFor';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export Buttons')}
				<p>
					${label('vBulletin', 'exportVb')}
					${input('checkbox', { id: 'exportVb', name: 'export', value: 'vb', checked: this.exportVb })}
				</p>
				<p>
					${label('IRC', 'exportIrc')}
					${input('checkbox', { id: 'exportIrc', name: 'export', value: 'irc', checked: this.exportIrc })}
				</p>
				<p>
					${label('Reddit', 'exportHwtf')}
					${input('checkbox', { id: 'exportHwtf', name: 'export', value: 'hwtf', checked: this.exportHwtf })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('vBulletin')}
					Show a button in the results to export the specified HIT with vBulletin &nbsp;
					formatted text to share on forums.
				</section>
				<section>
					${descriptionTitle('IRC')}
					Show a button in the results to export the specified HIT streamlined for sharing on IRC.
				</section>
				<section>
					${descriptionTitle('Reddit')}
					Show a button in the results to export the specified HIT for sharing on Reddit, formatted to &nbsp;
					<a style="color:black" href="${_hwtf}" target="_blank">
						r/HITsWorthTurkingFor
					</a> standards.
				</section>
			</div>
		</div>
	`;
}

function bubbleNewHITs () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Bubble New HITs')}
				<p>
					${label('Enable', 'bubbleNew')}
					${input('checkbox', { id: 'bubbleNew', checked: this.bubbleNew })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					When this option is enabled, new HITs will always be placed at the top of the results table.
				</section>
			</div>
		</div>
	`;
}

function alertVolume () {
	const common = { min: 0, max: 1, step: 0.02 };

	return `
		<div class="row">
			${sectionTitle('Alert Volume')}
			<p>
				${label('Ding')}
				${input('range', Object.assign(common, { name: 'ding', value: this.volume.ding }))}
				<span style="padding-left:10px">
					${Math.floor(this.volume.ding * 100)}%
				</span>
			</p>
			<p>
				${label('Squee')}
				${input('range', Object.assign(common, { name: 'squee', value: this.volume.squee }))}
				<span style="padding-left:10px">
					${Math.floor(this.volume.squee * 100)}%
				</span>
			</p>
		</div>
	`;
}

function tableColumns () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Results Table Columns')}
				<p>
					${label('Block', 'blockColumn')}
					${input('checkbox', { id: 'blockColumn', name: 'tableColumn', checked: this.blockColumn })}
				</p>
				<p>
					${label('Requester', 'requesterColumn')}
					${input('checkbox', { id: 'requesterColumn', name: 'tableColumn', checked: this.requesterColumn })}
				</p>
				<p>
					${label('# Avail', 'availableColumn')}
					${input('checkbox', { id: 'availableColumn', name: 'tableColumn', checked: this.availableColumn })}
				</p>
				<p>
					${label('Time', 'durationColumn')}
					${input('checkbox', { id: 'durationColumn', name: 'tableColumn', checked: this.durationColumn })}
				</p>
				<p>
					${label('TO Pay', 'topayColumn')}
					${input('checkbox', { id: 'topayColumn', name: 'tableColumn', checked: this.topayColumn })}
				</p>
				<p>
					${label('M', 'mastersColumn')}
					${input('checkbox', { id: 'mastersColumn', name: 'tableColumn', checked: this.mastersColumn })}
				</p>
				<p>
					${label('NQ', 'notqualifiedColumn')}
					${input('checkbox', { id: 'notqualifiedColumn', name: 'tableColumn', checked: this.notqualifiedColumn })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Block')}
					Buttons to block HIT by Requester, Title, ID
				</section>
				<section>
					${descriptionTitle('Requester')}
					Name of the HIT's requester
				</section>
				<section>
					${descriptionTitle('# Avail')}
					Number of available HITs in the group
				</section>
				<section>
					${descriptionTitle('Time')}
					The time allotted to complete the HIT
				</section>
				<section>
					${descriptionTitle('TO Pay')}
					The "pay" rating of the HIT's requester
				</section>
				<section>
					${descriptionTitle('M')}
					HIT requires Masters
				</section>
				<section>
					${descriptionTitle('NQ')}
					Not qualified for the HIT
				</section>
			</div>
		</div>
	`;
}

function general () {
	return `
		${exportButtons.apply(this.user)}
		${bubbleNewHITs.apply(this.user)}
		${alertVolume.apply(this.user)}
		${tableColumns.apply(this.user)}
	`;
}

function displayCheckboxes () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Display Checkboxes')}
				<p>
					${label('Show', 'checkshow')}
					${input('radio', { id: 'checkshow', name: 'checkbox', value: 'true', checked: this.showCheckboxes })}
				</p>
				<p>
					${label('Hide', 'checkhide')}
					${input('radio', { id: 'checkhide', name: 'checkbox', value: 'false', checked: !this.showCheckboxes })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Show')}
					Shows all checkboxes and radio inputs on the control panel for sake of clarity.
				</section>
				<section>
					${descriptionTitle('Hide')}
					Hides checkboxes and radio inputs for a cleaner, neater appearance. &nbsp;
					Their visibility is not required for proper operation; &nbsp;
					all options can still be toggled while hidden.
				</section>
			</div>
		</div>
	`;
}

function themes () {
	const options = [
		{ text: 'Classic', value: 'classic' },
		{ text: 'Deluge', value: 'deluge' },
		{ text: 'Solarium:Dark', value: 'solDark' },
		{ text: 'Solarium:Light', value: 'solLight' },
		{ text: 'Whisper', value: 'whisper' },
	];

	return `
		<div class="row">
			${sectionTitle('Themes')}
			<p class="no-align">
				${select(options, this.themes.name)}
				<button id="thedit" style="cursor:pointer">
					Edit Current Theme
				</button>
			</p>
		</div>
	`;
}

function hitColoring () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('HIT Coloring')}
				<p>
					${label('Link', 'link')}
					${input('radio', { id: 'link', name: 'hitColor', value: 'link', checked: this.hitColor === 'link' })}
				</p>
				<p>
					${label('Cell', 'cell')}
					${input('radio', { id: 'cell', name: 'hitColor', value: 'cell', checked: this.hitColor === 'cell' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Link')}
					Apply coloring based on Turkopticon reviews to all applicable links in the results table.
				</section>
				<section>
					${descriptionTitle('Cell')}
					Apply coloring based on Turkopticon reviews to the background of all &nbsp;
					applicable cells in the results table.
				</section>
			</div>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				The Classic theme is exempt from these settings and will always colorize cells.
			</p>
		</div>
	`;
}

function fontSize () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Font Size')}
				<p>
					${label('Normal', 'fontSize')}
					${input('number', { id: 'fontSize', name: 'fontSize', min: 5, value: this.fontSize })}
				</p>
				<p>
					${label('New HIT Offset', 'shineOffset')}
					${input('number', { id: 'shineOffset', name: 'shineOffset', value: this.shineOffset })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Normal')}
					Change the font size (measured in px) for text in the results table. &nbsp;
					Default is 11px.
				</section>
				<section>
					${descriptionTitle('New HIT Offset')}
					Controls the font size of new HITs relative to the rest of the results. &nbsp;
					Default is 1px.
					<br />
					<i>Example:</i> &nbsp;
					With a font size of 11px and an offset of 1px, new HITs will be displayed at 12px.
				</section>
			</div>
		</div>
	`;
}

function appearance () {
	return `
		${displayCheckboxes.apply(this.user)}
		${themes.apply(this.user)}
		${hitColoring.apply(this.user)}
		${fontSize.apply(this.user)}
	`;
}

function addJobButtons () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Add Job Buttons')}
				<p>
					${label('Panda', 'exportPcp')}
					${input('checkbox', { id: 'exportPcp', name: 'export', value: 'pc-p', checked: this.exportPcp })}
				</p>
				<p>
					${label('Once', 'exportPco')}
					${input('checkbox', { id: 'exportPco', name: 'export', value: 'pc-o', checked: this.exportPco })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Panda')}
					Show a button in the results to add the HIT to Panda Crazy as a Panda job.
				</section>
				<section>
					${descriptionTitle('Once')}
					Show a button in the results to add the HIT to Panda Crazy as a Once job.
				</section>
			</div>
		</div>
	`;
}

function pauseWithQueue () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Don\'t Auto-Refresh When Queue Not Empty')}
				<p>
					${label('Enable', 'pcQ')}
					${input('checkbox', { id: 'pcQueue', checked: this.pcQueue })}
				</p>
				<p>
					${label('Minimum HITs', 'pcQMin')}
					${input('number', { id: 'pcQMin', name: 'pcQueueMin', min: 1, max: 35, value: this.pcQueueMin })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Enable')}
					When this is enabled, HIT Scraper will not auto-refresh while there are HITs in your &nbsp;
					<a href="https://worker.mturk.com/tasks" target="_blank">
						Queue
					</a>.
				</section>
				<section>
					${descriptionTitle('Minimum HITs')}
					If there are at least this many HITs in the Queue, don't search until there are less.
					<br />
					Set this to 1 to disable auto-refresh while you're working on any HITs.
					<br />
					Example: If you set this to 5 then HIT Scraper won't auto-refresh until you have 4 or less &nbsp;
					HITs accepted (i.e. in your Queue).
				</section>
			</div>
		</div>
	`;
}

function pandaCrazy () {
	return `
		<p style="margin-left:15px">
			<b>
				<a href="https://greasyfork.org/en/scripts/19168-jr-mturk-panda-crazy" target="_blank">
					Panda Crazy
				</a> &nbsp;
				must be running for these options to work!
			</b>
		</p>
		${addJobButtons.apply(this.user)}
		${pauseWithQueue.apply(this.user)}
	`;
}

function colorType () {
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Color Type')}
				<p>
					${label('Simple', 'ctSim')}
					${input('radio', { id: 'ctSim', name: 'colorType', value: 'sim', checked: this.colorType === 'sim' })}
				</p>
				<p>
					${label('Adjusted', 'ctAdj')}
					${input('radio', { id: 'ctAdj', name: 'colorType', value: 'adj', checked: this.colorType === 'adj' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Simple')}
					HIT Scraper will use a simple weighted average to &nbsp;
					determine the overall TO rating and colorize results using that value. &nbsp;
					Use this setting to make coloring consistent between HIT Scraper and &nbsp;
					<a style="color:black" href="${_ccs}" target="_blank">
						Color Coded Search
					</a>.
				</section>
				<section>
					${descriptionTitle('Adjusted')}
					HIT Scraper will calculate a Bayesian adjusted average based on confidence &nbsp;
					of the TO rating to colorize results. &nbsp;
					Confidence is proportional to the number of reviews.
				</section>
			</div>
		</div>
	`;
}

function sortType () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Sort Type')}
				<p>
					${label('Simple', 'stSim')}
					${input('radio', { id: 'stSim', name: 'sortType', value: 'sim', checked: this.sortType === 'sim' })}
				</p>
				<p>
					${label('Adjusted', 'stAdj')}
					${input('radio', { id: 'stAdj', name: 'sortType', value: 'adj', checked: this.sortType === 'adj' })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Simple')}
					HIT Scraper will sort results based simply on value regardless of the number of reviews.
				</section>
				<section>
					${descriptionTitle('Adjusted')}
					HIT Scraper will use a Bayesian adjusted rating based on reliability &nbsp;
					(i.e. confidence) of the data. &nbsp;
					It factors in the number of reviews such that, for example, &nbsp;
					a requester with 100 reviews rated at 4.6 will rightfully be ranked higher &nbsp;
					than a requester with 3 reviews rated at 5. &nbsp;
					This gives a more accurate representation of the data.
				</section>
			</div>
		</div>
	`;
}

function toWeights () {
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	const common = { name: 'TOW', min: 1, max: 10, step: 0.5 };

	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('TO Weighting')}
				<p>
					${label('Communication', 'comm')}
					${input('number', Object.assign(common, { id: 'comm', value: this.toWeights.comm }))}
				</p>
				<p>
					${label('Pay', 'pay')}
					${input('number', Object.assign(common, { id: 'pay', value: this.toWeights.pay }))}
				</p>
				<p>
					${label('Fair', 'fair')}
					${input('number', Object.assign(common, { id: 'fair', value: this.toWeights.fair }))}
				</p>
				<p>
					${label('Fast', 'fast')}
					${input('number', Object.assign(common, { id: 'fast', value: this.toWeights.fast }))}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					Specify weights for TO attributes to place greater importance on certain attributes over others.
					<p>
						The default values, [1, 3, 3, 1], ensure consistency between HIT Scraper and &nbsp;
						<a style="color:black" href="${_ccs}" target="_blank">
							Color Coded Search
						</a> &nbsp;
						recommended values for adjusted coloring are [1, 6, 3.5, 1].
					</p>
				</section>
			</div>
		</div>
	`;
}

function other () {
	return `
		<div class="row">
			<div class="column opts">
				<p>
					${label('Timeout', 'toTimeout')}
					${input('number', { id: 'toTimeout', name: 'toTimeout', min: 1, max: 60, value: this.toTimeout })}
				</p>
				<p>
					${label('Async', 'asyncTO')}
					${input('checkbox', { id: 'asyncTO', checked: this.asyncTO })}
				</p>
				<p>
					${label('Cache Reviews', 'cacheTO')}
					${input('checkbox', { id: 'cacheTO', checked: this.cacheTO })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Timeout')}
					The max time (in seconds) to wait on a response from TO before giving up.
					<br />
					You might want a longer timeout (>15s) if you're using Async TO mode. &nbsp;
					Try out different values and see what works best for you.
				</section>
				<section>
					${descriptionTitle('Async')}
					When this option is enabled, Turkopticon reviews will be loaded in the background &nbsp;
					and won't delay searches.
					<br />
					Probably not a good idea to use this with short auto-refresh delay.
				</section>
				<section>
					${descriptionTitle('Cache Reviews')}
					When this option is enabled, Turkopticon reviews will be re-used when possible. &nbsp;
					For example, when a HIT shows up in the results more than once, its TO review &nbsp;
					data won't be refreshed and the old data will be used.
				</section>
			</div>
		</div>
	`;
}

function to () {
	return `
		${colorType.apply(this.user)}
		${sortType.apply(this.user)}
		${toWeights.apply(this.user)}
		${other.apply(this.user)}
	`;
}

var table = `
	<table class="ble" style="left:-100px;position:relative;width:110%;">
		<tr>
			<th class="blec ble">
			</th>
			<th class="blec ble">
				Matches
			</th>
			<th class="blec ble" style="width:86px">
				Does not match
			</th>
			<th class="blec ble">
				Notes
			</th>
		</tr>
		<tr>
			<td rowspan="2" class="blec ble">
				<code>foo*baz</code>
			</td>
			<td class="blec ble">
				foo bar bat baz
			</td>
			<td class="blec ble">
				bar foo bat baz
			</td>
			<td rowspan="2" class="blec ble">
				no leading or closing asterisks; <code>foo</code> must be at the start of a line, &nbsp;
				and <code>baz</code> must be at the end of a line for a positive match
			</td>
		</tr>
		<tr>
			<td class="blec ble">foobarbatbaz</td><td class="blec ble">
				foo bar bat
			</td>
		</tr>
		<tr>
			<td class="blec ble">
				<code>*foo</code>
			</td>
			<td class="ble blec">
				bar baz foo
			</td>
			<td class="blec ble">
				foo baz
			</td>
			<td class="ble blec">
				matches and blocks any line ending in <code>foo</code>
			</td>
		</tr>
		<tr>
			<td class="blec ble">
				<code>foo*</code>
			</td>
			<td class="ble blec">
				foo bat bar
			</td>
			<td class="ble blec">
				bat foo baz
			</td>
			<td class="ble blec">
				matches and blocks any line beginning with <code>foo</code>
			</td>
		</tr>
		<tr>
			<td class="ble blec" rowspan="4">
				<code>*bar*</code>
			</td>
			<td class="ble blec">
				foo bar bat baz
			</td>
			<td class="ble blec" rowspan="4">
				foo bat baz
			</td>
			<td class="ble blec" rowspan="4">
				matches and blocks any line containing <code>bar</code>
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				bar bat baz
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				foo bar
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				foobatbarbaz
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				<code>** foo</code>
			</td>
			<td class="ble blec">
				** foo
			</td>
			<td class="ble blec">
				** foo bar baz
			</td>
			<td class="ble blec">
				Multiple consecutive asterisks will be treated as a string rather than a wildcard. &nbsp;
				This makes it compatible with HITs using multiple asterisks in their titles, &nbsp;
				<i>e.g.</i>, <code>*** contains peanuts ***</code>.
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				<code>** *bar* ***
			</td>
			<td class="ble blec">
				** foo bar baz bat ***
			</td>
			<td class="ble blec">
				foo bar baz
			</td>
			<td class="ble blec">
				Consecutive asterisks used in conjunction with single asterisks.
			</td>
		</tr>
		<tr>
			<td class="ble blec">
				<code>*</code>
			</td>
			<td class="ble blec">
				<i>nothing</i>
			</td>
			<td class="ble blec">
				<i>all</i>
			</td>
			<td class="ble blec">
				A single asterisk would usually match anything and everything, &nbsp;
				but here, it matches nothing. &nbsp;
				This prevents accidentally blocking everything from the results table.
			</td>
		</tr>
	</table>
`;

function blocks () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Advanced Matching')}
				<p>
					${label('Allow Wildcards', 'wildblocks')}
					${input('checkbox', { id: 'wildblocks', checked: this.user.wildblocks })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					Allows for the use of asterisks <code>(*)</code> as wildcards &nbsp;
					in the blocklist for simple glob matching. &nbsp;
					Any blocklist entry without an asterisk is treated the same as the &nbsp;
					default behavior--the entry must exactly match a HIT title or requester to &nbsp;
					trigger a block.
					<p>
						<em>Wildcards have the potential to block more HITs than intended if &nbsp;
						using a pattern that's too generic.</em>
					</p>
					<p>
						Matching is not case sensitive regardless of the wildcard setting. &nbsp;
						Entries without an opening asterisk are expected to match the beginning of a line, &nbsp;
						likewise, entries without a closing asterisk are expected to match the end of a line. &nbsp;
						Example usage below.
					</p>
					${table}
				</section>
			</div>
		</div>
	`;
}

function additionalNotifications () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Additional Notifications')}
				<p>
					${label('Blink', 'notifyBlink')}
					${input('checkbox', { id: 'notifyBlink', name: 'notify', checked: this.notifyBlink })}
				</p>
				<p>
					${label('Taskbar', 'notifyTaskbar')}
					${input('checkbox', { id: 'notifyTaskbar', name: 'notify', checked: this.notifyTaskbar })}
				</p>
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Blink')}
					Blink the tab when there are new HITs.
				</section>
				<section>
					${descriptionTitle('Taskbar')}
					Create an HTML5 browser notification when there are new HITs, &nbsp;
					which appears over the taskbar for 10 seconds.
				</section>
			</div>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				These notification options will only apply when the page does not have active focus.
			</p>
		</div>
	`;
}

function notify () {
	return `
		${additionalNotifications.apply(this.user)}
	`;
}

function importExport () {
	return `
		<div class="row">
			<div class="column opts">
				${sectionTitle('Export/Import')}
				<p>
					<button id="sexport">
						Export
					</button>
				</p>
				<p>
					<button id="simport">
						Import
					</button>
				</p>
				${input('file', { id: 'fsimport', style: 'display:none;' })}
			</div>
			<div class="column opts-dsc">
				<section>
					${descriptionTitle('Export')}
					Export your current settings, block list, and include list as a local file.
				</section>
				<section>
					${descriptionTitle('Import')}
					Import your settings, block list, and include list from a local file.
				</section>
				<div style="margin-top:10px" id="eisStatus"></div>
			</div>
		</div>
	`;
}

function utils () {
	return `
		${importExport.apply(this.user)}
	`;
}

function main () {
	return cleanTemplate(`
		<div style="top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">
			<label id="settingsClose" class="close" title="Close">
				&#160;&#10008;&#160;
			</label>
		</div>
		<div id="settingsSidebar">
			<span data-target="general" class="settingsSelected">
				General
			</span>
			<span data-target="to">Turkopticon</span>
			<span data-target="pc">Panda Crazy</span>
			<span data-target="appearance">Appearance</span>
			<span data-target="blocklist">Blocklist</span>
			<span data-target="notify">Notifications</span>
			<span data-target="utils">Utilities</span>
		</div>
		<div id="panelContainer" style="margin-left:10px;border:none;overflow:auto;width:auto;height:92%">
			<div id="settings-general" class="settingsPanel">
				${general.apply(this)}
			</div>
			<div id="settings-to" class="settingsPanel">
				${to.apply(this)}
			</div>
			<div id="settings-pc" class="settingsPanel">
				${pandaCrazy.apply(this)}
			</div>
			<div id="settings-appearance" class="settingsPanel">
				${appearance.apply(this)}
			</div>
			<div id="settings-blocklist" class="settingsPanel">
				${blocks.apply(this)}
			</div>
			<div id="settings-notify" class="settingsPanel">
				${notify.apply(this)}
			</div>
			<div id="settings-utils" class="settingsPanel">
				${utils.apply(this)}
			</div>
		</div>
	`);
}

function draw () {
	const _main = main.apply(this);

	this.main = document.body.appendChild(document.createElement('DIV'));
	this.main.id = 'settingsMain';
	this.main.innerHTML = _main;
	return this;
}

function generateCSS(theme, mode) {
	var ref = theme === 'random' ? this.randomize() : Settings$1.user.themes.colors[theme],
		_ms = mode === 'cell' || theme === 'classic',
		cellFix = {
			row: k => `.${k} ` + (_ms ? '{background:' : 'a {color:') + ref[k] + '}',
			text: k => `.${k} {color:` + (_ms ? this.tune(ref.bodytable, ref[k]) : ref.bodytable) + '}',
			export: k => `.${k} button {color:` + (_ms ? this.tune(ref.export, ref[k]) : ref.export) + '}',
			vlink: k => `.${k} a:not(.static):visited {color:` + (_ms
				? this.tune(ref.vlink, ref[k])
				: ref.vlink) + '}'
		},
		css = `body {color:${ref.defaultText}; background-color:${ref.background}}
            /*#status {color:${ref.secondText}}*/
            #sortdirs {color:${ref.inputText}}
            #curtain {background:${ref.background}; opacity:0.5}
            .controlpanel i:after {color:${ref.accent}}
            #controlpanel {background:${ref.cpBackground}}
            #controlpanel input${theme === 'classic' ? '' : ', #controlpanel select'}
              {color:${ref.inputText}; border:1px solid; background:${theme === 'classic' ? '#fff' : ref.cpBackground}}
            #controlpanel label {color:${ref.defaultText}; background:${ref.cpBackground}}
            #controlpanel label:hover {background:${ref.hover}}
            #controlpanel label.checked {color:${ref.secondText}; background:${ref.highlight}}
            /*#resultsTable tbody a:not(.static):visited {color:${ref.vlink}}*/
            /*#resultsTable button {color:${ref.export}}*/
            thead, caption, a {color:${ref.defaultText}}
            tbody a {color:${ref.link}}
            .nohitDB {color:#000; background:${ref.nohitDB}}
            .hitDB {color:#000; background:${ref.hitDB}}
            .reqmaster {color:#000; background:${ref.reqmaster}}
            .nomaster {color:#000; background:${ref.nomaster}}
            .tooweak {background:${ref.unqualified}}
            ${cellFix.row('toNone')}    ${cellFix.text('toNone')}    ${cellFix.export('toNone')}    ${cellFix.vlink('toNone')}
            ${cellFix.row('toHigh')}    ${cellFix.text('toHigh')}    ${cellFix.export('toHigh')}    ${cellFix.vlink('toHigh')}
            ${cellFix.row('toGood')}    ${cellFix.text('toGood')}    ${cellFix.export('toGood')}    ${cellFix.vlink('toGood')}
            ${cellFix.row('toAverage')} ${cellFix.text('toAverage')} ${cellFix.export('toAverage')} ${cellFix.vlink('toAverage')}
            ${cellFix.row('toLow')}     ${cellFix.text('toLow')}     ${cellFix.export('toLow')}     ${cellFix.vlink('toLow')}
            ${cellFix.row('toPoor')}    ${cellFix.text('toPoor')}    ${cellFix.export('toPoor')}    ${cellFix.vlink('toPoor')}`;
	if (theme !== 'classic') css += `\n.controlpanel button {color:${ref.accent}; background:transparent;}`;
	return css;
}

function tune (fg, bg) {
	var cbg = this.getBrightness(bg),
		lighten = c => {
			c.s = Math.max(0, c.s - 5);
			c.v = Math.min(100, c.v + 5);
			return c;
		},
		darken = c => {
			c.s = Math.min(100, c.s + 5);
			c.v = Math.max(0, c.v - 5);
			return c;
		},
		tune = (function () { if (cbg >= 128) return darken; else return lighten; })(),
		hex2hsv = function (c) {
			var r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16),
				min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, _hue;
			switch (max) {
				case r:
					_hue = Math.round(60 * (g - b) / delta);
					break;
				case g:
					_hue = Math.round(120 + 60 * (b - r) / delta);
					break;
				case b:
					_hue = Math.round(240 + 60 * (r - g) / delta);
					break;
			}
			return {
				h: _hue < 0 ? _hue + 360 : _hue,
				s: max === 0 ? 0 : Math.round(100 * delta / max),
				v: Math.round(max * 100 / 255)
			};
		},
		hsv2hex = function (c) {
			var r, g, b, pad = s => ('00' + s.toString(16)).slice(-2);
			if (c.s === 0) r = g = b = Math.round(c.v * 2.55).toString(16);
			else {
				c = { h: c.h / 60, s: c.s / 100, v: c.v / 100 }; // convert to prime to calc chroma
				var _t1 = Math.round((c.v * (1 - c.s)) * 255),
					_t2 = Math.round((c.v * (1 - c.s * (c.h - Math.floor(c.h)))) * 255),
					_t3 = Math.round((c.v * (1 - c.s * (1 - (c.h - Math.floor(c.h))))) * 255);
				switch (Math.floor(c.h)) {
					case 1:
						r = _t2;
						g = Math.round(c.v * 255);
						b = _t1;
						break;
					case 2:
						r = _t1;
						g = Math.round(c.v * 255);
						b = _t3;
						break;
					case 3:
						r = _t1;
						g = _t2;
						b = Math.round(c.v * 255);
						break;
					case 4:
						r = _t3;
						g = _t1;
						b = Math.round(c.v * 255);
						break;
					case 0:
						r = Math.round(c.v * 255);
						g = _t3;
						b = _t1;
						break;
					default:
						r = Math.round(c.v * 255);
						g = _t1;
						b = _t2;
						break;
				}
			}
			return '#' + pad(r) + pad(g) + pad(b);
		};

	while (Math.abs(this.getBrightness(fg) - cbg) < 90) fg = hsv2hex(tune(hex2hsv(fg)));
	return fg;
}

function getBrightness (hex) {
	// TODO: put in Colors object
	var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
	return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

function apply (theme, mode) {
	var cssNew = URL.createObjectURL(new Blob([this.generateCSS(theme, mode)], { type: 'text/css' })),
		rel = document.head.querySelector('link[rel=stylesheet]'), cssOld = rel.href;
	rel.href = cssNew;
	URL.revokeObjectURL(cssOld);
}

class Themes {
	constructor() {
		this.default = defaults.themes;

		this.generateCSS = generateCSS.bind(this);
		this.tune = tune.bind(this);
		this.getBrightness = getBrightness.bind(this);
		this.apply = apply.bind(this);
	}
}
var Themes$1 = new Themes();

class FileHandler {
	static exports() {
		var obj = {
			settings: JSON.stringify(Settings$1.user),
			ignore_list: localStorage.getItem(IGNORE_KEY) || '',
			include_list: localStorage.getItem(INCLUDE_KEY) || ''
		},
			blob = new Blob([JSON.stringify(obj)], { type: 'application/json' }),
			a = document.body.appendChild(document.createElement('a'));
		a.href = URL.createObjectURL(blob);
		a.download = 'hitscraper_settings.json';
		a.click();
		a.remove();
	}
	static imports(e) {
		var f = e.target.files,
			invalid = () => Settings$1.main.querySelector('#eisStatus').textContent = 'Invalid file.';
		if (!f.length) return;
		if (!f[0].name.includes('json')) return invalid();
		var reader = new FileReader();
		reader.readAsText(f[0]);
		reader.onload = function () {
			var obj;
			try { obj = JSON.parse(this.result); } catch (err) { return invalid(); }
			for (var key of ['settings', 'ignore_list', 'include_list']) {
				if (key in obj && typeof obj[key] === 'string')
					localStorage.setItem(IGNORE_KEY.replace('ignore_list', key), obj[key]);
			}
			initialize();
		};
	}
}

function Editor$1 (type) {
	if (!type) {
		return {
			setDefaultBlocks,
		};
	}
	Interface$2.toggleOverflow('on');
	this.node = document.body.appendChild(document.createElement('DIV'));
	this.node.classList.add('pop');
	this.die = () => {
		Interface$2.toggleOverflow('off');
		this.node.remove();
	};
	this.type = type;
	this.caller = arguments[1] || null;

	function setDefaultBlocks() {
		// TODO seems like this should go under Settings? (make static method for it)
		return localStorage.setItem(IGNORE_KEY,
			'oscar smith^diamond tip research llc^jonathan weber^jerry torres^' +
			'crowdsource^we-pay-you-fast^turk experiment^jon brelig^p9r^scoutit');
	}

	switch (type) {
		case 'include':
		case 'ignore':
			if (type === 'ignore' && !localStorage.getItem(IGNORE_KEY)) setDefaultBlocks();

			const btnStyle = 'margin:5px auto;width:50%;color:white;background:black;';

			const blocklist = cleanTemplate(`
				<b>BLOCKLIST</b> - &nbsp;
				Edit the blocklist with what you want to ignore/hide. &nbsp;
				Separate requester names and HIT titles with the &nbsp;
				<code>^</code> character. &nbsp;
				After clicking "Save", you'll need to scrape again to apply the changes.
				<br />
				<button id="clearIds">
					Clear HIT IDs
				</button>
			`);
			const includelist = cleanTemplate(`
				<b>INCLUDELIST</b> - &nbsp;
				Focus the results on your favorite requesters. &nbsp;
				Separate requester names and HIT titles with the ' +
				'<code>^</code> character. When the "Restrict to includelist" option is selected, ' +
				'HIT Scraper only shows results matching the includelist.'
			`);
			var titleText = type === 'ignore' ? blocklist : includelist;

			this.node.innerHTML = cleanTemplate(`
				<div style="width:500px">
					${titleText}
				</div>
				<textarea style="display:block;height:200px;width:500px;font:12px monospace" placeholder="nothing here yet">
					${localStorage.getItem(IGNORE_KEY.replace('ignore', type)) || ''}
				</textarea>
				<button id="edSave" style="${btnStyle}">
					Save
				</button>
				<button id="edCancel" style="${btnStyle}">
					Cancel
				</button>
			`);
			if (type === 'ignore') {
				this.node.querySelector('#clearIds').onclick = () => {
					const textarea = this.node.querySelector('textarea');
					textarea.value = textarea.value.replace(/\^\w{30}/g, '');
				};
			}
			this.node.querySelector('#edSave').onclick = () => {
				localStorage.setItem(IGNORE_KEY.replace('ignore', type), this.node.querySelector('textarea').value.trim());
				this.die();
			};
			break;
		case 'theme':
			var dlbody = [], _th = Settings$1.user.themes, split = obj => {
				var a = [];
				for (var k in obj) if (obj.hasOwnProperty(k)) a.push({ k: k, v: obj[k] });
				return a.sort((a, b) => a.k < b.k ? -1 : 1);
			}, _colors = split(_th.colors[_th.name]),
				define = k => '<div style="margin-left:37px">' + _dd[k] + '</div>',
				_dd = {
					highlight: 'Distinguishes between active and inactive states in the control panel',
					background: 'Background color',
					accent: 'Color of spacer text (and control panel buttons on themes other than \'classic\')',
					bodytable: 'Default color of text elements in the results table (this is ignored if HIT coloring is set to \'cell\')',
					cpBackground: 'Background color of the control panel',
					toHigh: 'Color for results with high TO',
					toGood: 'Color for results with good TO',
					toAverage: 'Color for results with average TO',
					toLow: 'Color for results with low TO',
					toPoor: 'Color for results with poor TO',
					toNone: 'Color for results with no TO',
					hitDB: 'Designates that a match was found in your HITdb',
					nohitDB: 'Designates that a match was not found in your HITdb',
					unqualified: 'Designates that you do not have the qualifications necessary to work on the HIT',
					reqmaster: 'Designates HITs that require Masters',
					nomaster: 'Designates HITs that do not require Masters',
					defaultText: 'Default text color',
					inputText: 'Color of input boxes in the control panel',
					secondText: 'Color for text used on selected control panel items',
					link: 'Default color of unvisited links',
					vlink: 'Default color of visited links',
					export: 'Color of buttons in the results table--export and block buttons',
					hover: 'Color of control panel options on mouseover'
				};
			for (var r of _colors)
				dlbody.push(`<dt>${r.k}</dt><dd><div class="icbutt"><input data-key="${r.k}" type="color" value="${r.v}" /></div>${define(r.k)}</dd>`);
			this.node.innerHTML = '<b>THEME EDITOR</b><p></p><div style="height:87%;overflow:auto"><dl>' + dlbody.join('') + '</dl></div>' +
				'<button id="edSave" style="margin:5px auto;width:33%;color:white;background:black">Save</button>' +
				'<button id="edDefault" style="margin:5px auto;width:33%;color:white;background:black">Restore Default</button>' +
				'<button id="edCancel" style="margin:5px auto;width:33%;color:white;background:black">Cancel</button>';
			this.node.style.height = '57%';
			Array.from(this.node.querySelectorAll('.icbutt')).forEach(v => {
				v.style.background = v.firstChild.value;
				v.firstChild.onchange = e => {
					var k = e.target.dataset.key;
					v.style.background = e.target.value;
					_th.colors[_th.name][k] = e.target.value;
					Themes$1.apply(_th.name, Settings$1.user.hitColor);
				};
			});
			this.node.querySelector('#edDefault').onclick = () => {
				_th.colors[_th.name] = Themes$1.default[_th.name];
				Themes$1.apply(_th.name, Settings$1.user.hitColor);
				this.die();
				new Editor('theme');
			};
			this.node.querySelector('#edSave').onclick = () => {
				Settings$1.save();
				this.die();
			};
			break;
		case 'vbTemplate':
			this.node.innerHTML = '<b>VBULLETIN TEMPLATE</b><div style="float:right;margin-bottom:5px">Ratings Symbol: ' +
				`<input style="text-align:center" type="text" size="1" maxlength="1" value="${Settings$1.user.vbSym}" /></div>` +
				'<textarea style="display:block;height:200px;width:500px;font:12px monospace">' +
				Settings$1.user.vbTemplate + '</textarea>' +
				'<button id="edSave" style="margin:5px auto;width:33%;color:white;background:black">Save</button>' +
				'<button id="edDefault" style="margin:5px auto;width:33%;color:white;background:black">Restore Default</button>' +
				'<button id="edCancel" style="margin:5px auto;width:33%;color:white;background:black">Cancel</button>';
			this.node.querySelector('#edDefault').onclick = () => {
				this.node.querySelector('textarea').value = Settings$1.defaults.vbTemplate;
				this.node.querySelector('#edSave').click();
			};
			this.node.querySelector('#edSave').onclick = () => {
				Settings$1.user.vbTemplate = this.node.querySelector('textarea').value.trim();
				Settings$1.user.vbSym = this.node.querySelector('input').value;
				Settings$1.save();
				this.die();
				new Exporter({ target: this.caller });
			};
			break;
	}
	this.node.querySelector('#edCancel').onclick = () => this.die();
}

function init () {
	var get = (q, all) => this.main['querySelector' + (all ? 'All' : '')](q),
		sidebarFn = function (e) {
			if (e.target.classList.contains('settingsSelected')) return; // already selected

			get('#settings-' + get('.settingsSelected').dataset.target).style.display = 'none';
			get('.settingsSelected').classList.toggle('settingsSelected');
			e.target.classList.toggle('settingsSelected');
			get('#settings-' + e.target.dataset.target).style.display = 'block';
		}.bind(this),
		sliderFn = function (e) {
			e.target.nextElementSibling.textContent = Math.floor(e.target.value * 100) + '%';
		},
		optChangeFn = function (e) {
			var tag = e.target.tagName, type = e.target.type, id = e.target.id,
				isChecked = e.target.checked, name = e.target.name, value = e.target.value;

			switch (tag) {
				case 'SELECT': {
					//get('#thedit').textContent = value === 'random' ? 'Re-roll!' : 'Edit Current Theme';
					this.user.themes.name = value;
					Themes$1.apply(value, this.user.hitColor);
					break;
				}
				case 'INPUT': {
					switch (type) {
						case 'radio': {
							if (name === 'checkbox') {
								this.user.showCheckboxes = (value === 'true');
								Array.from(document.querySelectorAll('#controlpanel input[type=checkbox],#controlpanel input[type=radio]'))
									.forEach(v => v.classList.toggle('hidden'));
							}
							else this.user[name] = value;
							if (name === 'hitColor') Themes$1.apply(this.user.themes.name, value);
							break;
						}
						case 'checkbox': {
							this.user[id] = isChecked;
							if (name === 'export') {
								Array.from(document.querySelectorAll(`button.${value}`))
									.forEach(v => v.style.display = isChecked ? 'inline' : 'none');
							}
							if (id === 'notifyTaskbar' && isChecked && Notification.permission === 'default') {
								Notification.requestPermission();
							}
							if (name === 'tableColumn') {
								const columnName = id.replace('Column', '');
								const display = isChecked ? 'table-cell' : 'none';

								Array.from(document.querySelectorAll(`.${columnName}-tc`))
									.forEach((el) => el.style.display = display);
							}
							break;
						}
						case 'number': {
							value = +value;

							if (name === 'fontSize') {
								document.head.querySelector('#lazyfont').sheet.cssRules[0].style.fontSize = value + 'px';
							} else if (name === 'shineOffset') {
								document.head.querySelector('#lazyfont').sheet.cssRules[1].style.fontSize = +this.user.fontSize + value + 'px';
							}

							if (name === 'TOW') {
								this.user.toWeights[id] = value;
							} else {
								this.user[name] = value;
							}
							break;
						}
						case 'range': {
							this.user.volume[name] = value;
							let audio = document.querySelector(`#${name}`);
							audio.volume = value;
							audio.play();
							break;
						}
						case 'text': {
							this.user[id] = value;
							break;
						}
					}
					break;
				}
			}
			this.save();
		}.bind(this);

	get('#settingsClose').onclick = this.die.bind(this);
	get('#settings-general').style.display = 'block';
	Array.from(get('#settingsSidebar span', true)).forEach(v => v.onclick = sidebarFn);
	Array.from(get('input:not([type=file]),select', true)).forEach(v => v.onchange = optChangeFn);
	Array.from(get('input[type=range]', true)).forEach(v => v.oninput = sliderFn);
	get('#thedit').onclick = () => {
		this.die.call(this);
		new Editor$1('theme');
	};
	get('#sexport').onclick = FileHandler.exports;
	get('#simport').onclick = () => {
		get('#fsimport').value = '';
		get('#eisStatus').innerHTML = '';
		get('#fsimport').click();
	};
	get('#fsimport').onchange = FileHandler.imports;
}

function die () {
	Interface$2.toggleOverflow('off');
	this.main.remove();
}

class Settings {
	constructor() {
		this.defaults = defaults$1;
		this.user = {};

		this.save = save.bind(this);
		this.draw = draw.bind(this);
		this.init = init.bind(this);
		this.die = die.bind(this);
	}
}
var Settings$1 = new Settings();

function resetTitle () {
	if (this.blackhole.blink) clearInterval(this.blackhole.blink);
	document.title = DOC_TITLE;
}

function toggleOverflow (state) {
	document.body.querySelector('#curtain').style.display = state === 'on' ? 'block' : 'none';
	document.body.style.overflow = state === 'on' ? 'hidden' : 'auto';
}

var editorsExporters = `
	/* for editors/exporters */
	.pop {
		position: fixed;
		top: 15%;
		left: 50%;
		margin: auto;
		transform: translateX(-50%);
		padding: 5px;
		background: black;
		color: white;
		z-index: 20;
		font-size: 12px;
		box-shadow: 0px 0px 6px 1px #fff;
	}
	dt {
		text-transform: uppercase;
		clear: both;
		margin: 3px;
	}
	.icbutt {
		float: left;
		border: 1px solid #fff;
		cursor: pointer;
	}
	.icbutt > input {
		opacity: 0;
		display: block;
		width: 25px;
		height: 25px;
		border: none;
	}
`;

var settings = `
	/* settings */
	#settingsMain {
		z-index: 20;
		position: fixed;
		background: #fff;
		color: #000;
		box-shadow: -3px 3px 2px 2px #7B8C89;
		line-height: initial;
		top: 50%;
		left: 50%;
		width: 85%;
		height: 85%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
	}
	#settingsMain > div {
		margin: 5px;
		padding: 3px;
		position: relative;
		border: 1px solid grey;
		line-height: initial;
	}
	.close {
		position: relative;
		font-weight: bold;
		font-size: 1em;
		color: white;
		background: black;
		cursor: pointer;
	}
	#settingsSidebar {
		width: 100px;
		min-width: 90px;
		height: 92%;
		float: left
	}
	#settingsSidebar > span {
		display: block;
		margin-bottom: 5px;
		width: 100%;
		font-size: 1em;
		cursor: pointer;
	}
	.settingsPanel {
		position: absolute;
		top: 0;
		left: 0;
		display: none;
		width: 100%;
		height: 100%;
		font-size: 11px;
	}
	.settingsPanel > div {
		margin: 15px 5px;
		position: relative;
		background: #CCFFFA;
		overflow: auto;
		padding: 6px 10px;
	}
	.settingsPanel section:not(:only-of-type) {
		padding: 4px 0;
	}
	.settingsPanel section:not(:only-of-type):not(:last-of-type) {
		border-bottom: 1px solid lightgray;
	}
	.settingsSelected {
		background: aquamarine;
	}
	.ble {
		border: 1px solid black;
		border-collapse: collapse;
	}
	.blec {
		padding: 5px;
		text-align: left;
	}

	.row:after {
    content: "";
    display: table;
    clear: both;
	}
	.column {
		float: left;
	}
	.column.opts {
		width: 35%;
	}
	.column.opts-dsc {
		width: 65%;
	}
	.dsc-title {
		font-style: italic;
		font-weight: bold;
		display: block;
	}
	.sec-title {
		font-size: 1.2em;
		border-bottom: 2px solid;
		padding-bottom: 1px;
		line-height: 20px;
	}
	.column.opts > p:not(.no-align) {
		position: relative;
	}
	.column.opts > p:not(.no-align) > input[type="checkbox"],
	.column.opts > p:not(.no-align) > input[type="radio"],
	.column.opts > p:not(.no-align) > input[type="number"] {
		position: absolute;
		right: 10px;
	}
`;

var resultsTable = `
	#resultsTable button.block {
		padding: 1px 4px;
		margin-right: 1px;
	}
	.toLink, .hit-title {
		position: relative;
	}
	.toLink:before, .hit-title:before {
		content: "";
		display: none;
		z-index: 5;
		position: absolute;
		top: 0;
		left: -6px;
		width: 0;
		height: 0;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		border-left: 6px solid black;
	}
	.toLink:hover:before, .hit-title:hover:before {
		display: block;
	}
	.tooltip {
		z-index: 5;
		position: absolute;
		top: 0;
		right: calc(100% + 6px);
		text-align: left;
		transform: translateY(-20%);
		padding: 5px;
		font-weight: normal;
		font-size: 11px;
		line-height: 1;
		display: none;
		background: black;
		color: white;
		box-shadow: 0px 0px 6px 1px #fff;
	}
	meter {
		width: 100%;
		position: relative;
		height: 15px;
	}
	meter:before, .ffmb {
		display: block;
		font-size: 10px;
		font-weight: bold;
		color: black;
		content: attr(data-attr);
		position: absolute;
		top: 1px;
	}
	meter:after, .ffma {
		display: block;
		font-size: 10px;
		font-weight: bold;
		color: black;
		content: attr(value);
		position: absolute;
		top: 1px;
		right: 0;
	}
	#resultsTable button {
		border-radius: 3px;
		font-size: 0.75em;
		border: 1px solid;
		padding: 0;
		background: transparent;
	}
	#resultsTable .ex {
		padding: 0 9px;
	}
	#resultsTable .pc-p, #resultsTable .pc-o {
		background-color: rgba(0, 50, 150, 0.75);
		color: white;
	}
	#resultsTable tbody td > div {
		display: table-cell;
	}
	#resultsTable tbody td > div:first-child {
		padding-right: 2px;
		vertical-align: middle;
		white-space: nowrap;
	}
	.ignored td {
		border:2px solid #00E5FF;
	}
	.includelisted td {
		border:2px dashed #008800;
	}
	.blocklisted td {
		border:2px solid #cc0000;
	}

	#resultsTable thead td:first-of-type {
		border-left: 1px solid;
	}
	#resultsTable thead td:not(:last-of-type) {
		border-right: 1px solid;
	}
	#resultsTable td { padding: 0 3px; }
	.block-tc { width: 65px; text-align: center; }
	.requester-tc {  }
	.title-tc {  }
	.rewardpanda-tc { width: 70px; }
	.available-tc { width: 35px; }
	.duration-tc { width: 67px; }
	.topay-tc { width: 30px; }
	.masters-tc { width: 15px; }
	.notqualified-tc { width: 15px; }
`;

var status = `
	.spinner {
		display: inline-block;
		animation: kfspin 0.7s infinite linear;
		font-weight: bold;
	}
	@keyframes kfspin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(359deg);
		}
	}
	.spinner:before {
		content: "*";
	}
	#status-retrieving-to.hidden {
		/* prevent screen jump from asyncTO */
		display: block !important;
		visibility: hidden;
	}
	button#btnRetryTO.disabled {
		background-color: lightgray;
    color: darkgray;
	}
	button#btnRetryTO:focus {
		outline: 0;
	}
`;

var css = `
	* {
		box-sizing: border-box;
	}
	body {
		font-family: Verdana, Arial;
		font-size: 14px;
		margin: 0;
	}
	p {
		margin: 8px auto;
	}
	.cpdefault {
		display: inline-block;
		visibility: visible;
		overflow: hidden;
		padding: 8px 5px 1px 5px;
		transition: all 0.3s;
	}
	#controlpanel i:after, #status i:after {
		content: " | ";
	}
	input[type="checkbox"], input[type="radio"] {
		vertical-align: middle;
	}
	input[type="number"] {
		width: 50px;
		text-align: center;
	}
	label {
		padding: 2px;
	}
	.hiddenpanel {
		width: 0px;
		height: 0px;
		visibility: hidden;
	}
	.hidden {
		display: none;
	}
	button {
		border: 1px solid;
	}
	textarea {
		font-family: inherit;
		font-size: 11px;
		margin: auto;
		padding: 2px;
	}
	button.disabled:not(#btnRetryTO) {
		position: relative;
	}
	button.disabled:not(#btnRetryTO):before {
		content: "";
		display: none;
		z-index: 5;
		position: absolute;
		top: -7px;
		left: 50%;
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid black;
		transform: translateX(-50%);
	}
	button.disabled:not(#btnRetryTO):after {
		content: "Exports are disabled while logged out.";
		display: none;
		z-index: 5;
		position: absolute;
		top: -7px;
		left: 50%;
		color: white;
		background: black;
		width: 230px;
		padding: 2px;
		transform: translate(-50%,-100%);
		box-shadow: 0px 0px 6px 1px #fff;
		font-size: 12px;
	}
	button.disabled:not(#btnRetryTO):focus:before {
		display: block;
	}
	button.disabled:not(#btnRetryTO):focus:after {
		display: block;
	}

	${editorsExporters}
	${settings}
	${resultsTable}
	${status}
`;

// import { ENV } from '../lib/constants';

var titles = {
	refresh: 'Enter search refresh delay in seconds.\nEnter 0 for no auto-refresh.\nDefault is 0 (no auto-refresh).',
	pages: 'Enter number of pages to scrape. Default is 1.',
	skips: 'Searches additional pages to get a more consistent number of results. Helpful if you\'re blocking a lot of items.',
	resultsPerPage: 'Number of results to return per page (maximum is 100, default is 30)',
	batch: 'Enter minimum HITs for batch search (must be searching by Most Available).',
	reward: 'Enter the minimum desired pay per HIT (e.g. 0.10).',
	qual: 'Only show HITs you\'re currently qualified for (must be logged in).',
	monly: 'Only show HITs that require Masters qualifications.',
	mhide: 'Remove masters hits from the results if selected, otherwise display both masters and non-masters HITS.\n' +
		'The \'qualified\' setting supercedes this option.',
	searchBy: 'Get search results by...\n Latest = HIT Creation Date (newest first),\n ' +
		'Most Available = HITs Available (most first),\n Reward = Reward Amount (most first),\n Title = Title (A-Z)',
	invert: 'Reverse the order of the Search By choice, so...\n Latest = HIT Creation Date (oldest first),\n ' +
		'Most Available = HITs Available (least first),\n Reward = Reward Amount (least first),\n Title = Title (Z-A)',
	shine: 'Enter time (in seconds) to keep new HITs highlighted.\nDefault is 300 (5 minutes).',
	sound: 'Play a sound when new results are found.',
	soundSelect: 'Select which sound will be played.',
	minTOPay: 'After getting search results, hide any results below this average Turkopticon pay rating.\n' +
		'Minimum is 1, maximum is 5, decimals up to 2 places, such as 3.25',
	hideNoTO: 'After getting search results, hide any results that have no, or too few, Turkopticon pay ratings.',
	disableTO: 'Disable attempts to download ratings data from Turkopticon for the results table.\n' +
		'NOTE: TO is cached. That means if TO is availible from a previous scrape, it will use that value even if ' +
		'TO is disabled. This option only prevents the retrieval of ratings from the Turkopticon servers,',
	sortPay: 'After getting search results, re-sort the results based on their average Turkopticon pay ratings.',
	sortAll: 'After getting search results, re-sort the results by their overall Turkopticon rating.',
	sortAsc: 'Sort results in ascending (low to high) order.',
	sortDsc: 'Sort results in descending (high to low) order.',
	search: 'Enter keywords to search for; default is blank (no search terms).',
	hideBlock: 'When enabled, hide HITs that match your blocklist.\n' +
		'When disabled, HITs that match your blocklist will be displayed with a red border.',
	onlyIncludes: 'Show only HITs that match your includelist.\nBe sure to edit your includelist first or no results will be displayed.',
	shineInc: 'Outline HITs that match your includelist with a dashed green border.',
	// mainlink: 'Version: ' + ENV.VERSION + '\nRead the documentation for HIT Scraper With Export on its Greasyfork page.',
	gbatch: 'Apply the \'Minimum batch size\' filter to all search options.',
	onlyViable: 'Filters out HITs with qualifications you do not have and \ncan neither request nor take a test to obtain.\n' +
		'Does not work while logged out.'
};

var enums = {
	searchBy: {
		LATEST: 0,
		MOST_AVAILABLE: 1,
		REWARD: 2,
		TITLE: 3,
	},
}

function table$1 () {
	return `
		<div id="results">
			<table id="resultsTable" style="width:100%">
				<caption style="font-weight:800;line-height:1.25em;font-size:1.5em;">
					HIT Scraper Results
				</caption>
				<thead>
					<tr style="font-weight:800;font-size:0.87em;text-align:center">
						<td class="block-tc ${hidden('block')}">Block</td>
						<td class="requester-tc ${hidden('requester')}">
							Requester
						</td>
						<td class="title-tc">
							Title
						</td>
						<td class="rewardpanda-tc">
							Reward &amp; PandA
						</td>
						<td class="available-tc ${hidden('available')}">
							# Avail
						</td>
						<td class="duration-tc ${hidden('duration')}">
							Time
						</td>
						<td class="topay-tc ${hidden('topay')}">
							TO Pay
						</td>
						<td class="masters-tc ${hidden('masters')}">
							M
						</td>
						<td class="notqualified-tc ${hidden('notqualified')}"></td>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	`;
}

function hidden(settingName, force) {
	if (force) return 'hidden';

	if (Settings$1.user[settingName + 'Column']) return '';
	return 'hidden';
}

var status$1 = `
	<div id="status">
		<p id="status-stopped">
			Stopped
		</p>
		<p id="status-processing" class="hidden">
			<b class="spinner"></b>
			Processing page: &nbsp;
			<span>1</span>
		</p>
		<p id="status-correcting-skips" class="hidden">
			Correcting for skips
		</p>
		<p id="status-retrieving-to" class="hidden">
			<b class="spinner"></b>
			Retrieving TO data
		</p>
		<p id="status-to-error" class="hidden">
			Error retrieving TO data. &nbsp;
			<button id="btnRetryTO">
				Retry
			</button>
		</p>
		<p id="status-scrape-complete" class="hidden">
			Scrape Complete: &nbsp;
			<span></span>
		</p>
		<p id="status-queue-wait" class="hidden">
			Queue not empty. Waiting to Auto-Refresh. &nbsp;
			<button id="btnRetryQueue">
				Retry
			</button>
		</p>
		<p id="status-scraping-again" class="hidden">
			Scraping again in &nbsp;
			<span>0</span>
			&nbsp; seconds
		</p>
	</div>
`;

function body () {
	const { user } = Settings$1;

	const _cb = user.showCheckboxes ? '' : 'hidden';
	const _u0 = new Uint8Array(Array.prototype.map.call(window.atob(audio0), v => v.charCodeAt(0)));
	const _u1 = new Uint8Array(Array.prototype.map.call(window.atob(audio1), v => v.charCodeAt(0)));
	const ding = URL.createObjectURL(new Blob([_u0], { type: 'audio/ogg' }));
	const squee = URL.createObjectURL(new Blob([_u1], { type: 'audio/mp3' }));

	const ph = Settings$1.user.hidePanel ? 'hiddenpanel' : '';
	const phB = Settings$1.user.hidePanel ? 'Show Panel' : 'Hide Panel';

	return cleanTemplate(`
		<audio id="ding">
			<source src="${ding}">
		</audio>
		<audio id="squee">
			<source src="${squee}">
		</audio>
		<div id="curtain" style="position:fixed;width:100%;height:100%;display:none;z-index:10"></div>
		<div id="controlpanel" class="controlpanel cpdefault ${ph}">
			<p>
				Auto-refresh delay: &nbsp;
				<input &nbsp;
					id="refresh"
					type="number"
					title="${titles.refresh}"
					min="0"
					value="${user.refresh}"
				/>
				<i></i>

				Pages to scrape: &nbsp;
				<input &nbsp;
					id="pages"
					type="number"
					title="${titles.pages}"
					min="1"
					max="100"
					value="${user.pages}"
				/>
				<i></i>

				<label class="${user.skips ? 'checked' : ''}" title="${titles.skips}" for="skips">
					Correct for skips
				</label>
				<input &nbsp;
					id="skips"
					class="${_cb}"
					type="checkbox"
					title="${titles.skips}"
					${user.skips ? 'checked' : ''}
				/>
				<i></i>

				Results per page: &nbsp;
				<input &nbsp;
					id="resultsPerPage"
					type="number"
					title="${titles.resultsPerPage}"
					min="1"
					max="100"
					value="${user.resultsPerPage || 10}"
				/>
			</p>
			<p>
				Min reward: &nbsp;
				<input &nbsp;
					id="reward"
					type="number"
					title="${titles.reward}"
					min="0"
					step="0.05"
					value="${user.reward}"
				/>
				<i></i>

				<label class="${user.qual ? 'checked' : ''}" title="${titles.qual}" for="qual">
					Qualified
				</label>
				<input &nbsp;
					id="qual"
					class="${_cb}"
					type="checkbox"
					title="${titles.qual}"
					${user.qual ? 'checked' : ''}
				/>
				<i></i>

				<label class="${user.monly ? 'checked' : ''}" title="${titles.monly}" for="monly">
					Masters Only
				</label>
				<input &nbsp;
					id="monly"
					class="${_cb}"
					type="checkbox"
					title="${titles.monly}"
					${user.monly ? 'checked' : ''}
				/>
				<i></i>

				<label class="${user.mhide ? 'checked' : ''}" title="${titles.mhide}" for="mhide">
					Hide Masters
				</label>
				<input &nbsp;
					id="mhide"
					class="${_cb}"
					type="checkbox"
					title="${titles.mhide}"
					${user.mhide ? 'checked' : ''}
				/>
				<i></i>

				<label class="${user.onlyViable ? 'checked' : ''}" title="${titles.onlyViable}" for="onlyViable">
					Hide Infeasible
				</label>
				<input &nbsp;
					id="onlyViable"
					class="${_cb}"
					type="checkbox"
					title="${titles.onlyViable}"
					${user.onlyViable ? 'checked' : ''}
				/>
				<i></i>

				Min batch size: &nbsp;
				<input &nbsp;
					id="batch"
					type="number"
					title="${titles.batch}"
					min="1"
					value="${user.batch}"
				/> - &nbsp;
				<label class="${user.gbatch ? 'checked' : ''}" title="${titles.gbatch}" for="gbatch">
					Global
				</label>
				<input &nbsp;
					id="gbatch"
					class="${_cb}"
					type="checkbox"
					title="${titles.gbatch}"
					${user.gbatch ? 'checked' : ''}
				/>
			</p>
			<p>
				New HIT highlighting: &nbsp;
				<input &nbsp;
					id="shine"
					type="number"
					title="${titles.shine}"
					min="0"
					max="3600"
					value="${user.shine}"
				/>
				<i></i>

				<label class="${user.notifySound[0] ? 'checked' : ''}" title="${titles.sound}" for="sound">
					Sound on new HIT
				</label>
				<input &nbsp;
					id="sound"
					class="${_cb}"
					type="checkbox"
					title="${titles.sound}"
					${user.notifySound[0] ? 'checked' : ''}
				/>
				<select &nbsp;
					id="soundSelect"
					title="${titles.soundSelect}"
					style="display:${user.notifySound[0] ? 'inline' : 'none'}"
				>
					<option value="ding" ${user.notifySound[1] === 'ding' ? 'selected' : ''}>
						Ding
					</option>
					<option value="squee" ${user.notifySound[1] === 'squee' ? 'selected' : ''}>
						Squee
					</option>
				</select>
				<i></i>

				<label class="${user.disableTO ? 'checked' : ''}" title="${titles.disableTO}" for="disableTO">
					Disable TO
				</label>
				<input &nbsp;
					id="disableTO"
					class="${_cb}"
					type="checkbox"
					title="${titles.disableTO}"
					${user.disableTO ? 'checked' : ''}
				/>
				<i></i>

				Search by: &nbsp;
				<select id="searchBy" title="${titles.searchBy}">
					<option value="late" ${user.searchBy === enums.searchBy.LATEST ? 'selected' : ''}>
						Latest
					</option>
					<option value="most" ${user.searchBy === enums.searchBy.MOST_AVAILABLE ? 'selected' : ''}>
						Most Available
					</option>
					<option value="amount" ${user.searchBy === enums.searchBy.REWARD ? 'selected' : ''}>
						Reward
					</option>
					<option value="alpha" ${user.searchBy === enums.searchBy.TITLE ? 'selected' : ''}>
						Title
					</option>
				</select> - &nbsp;
				<label class="${user.invert ? 'checked' : ''}" title="${titles.invert}" for="invert">
					Invert
				</label>
				<input &nbsp;
					id="invert"
					class="${_cb}"
					type="checkbox"
					title="${titles.invert}"
					${user.invert ? 'checked' : ''}
				/>
			</p>
			<p>
				Min pay TO: &nbsp;
				<input &nbsp;
					id="minTOPay"
					type="number"
					title="${titles.minTOPay}"
					min="1"
					max="5"
					step="0.25"
					value="${user.minTOPay}"
				/>
				<i></i>

				<label class="${user.hideNoTO ? 'checked' : ''}" title="${titles.hideNoTO}" for="hideNoTO">
					Hide no TO
				</label>
				<input &nbsp;
					id="hideNoTO"
					class="${_cb}"
					type="checkbox"
					title="${titles.hideNoTO}"
					${user.hideNoTO ? 'checked' : ''}
				/>
				<i></i>

				<label class="${user.sortPay ? 'checked' : ''}" title="${titles.sortPay}" for="sortPay">
					Sort by TO pay
				</label>
				<input &nbsp;
					id="sortPay"
					class="${_cb}"
					type="checkbox"
					title="${titles.sortPay}"
					name="sort"
					${user.sortPay ? 'checked' : ''}
				/>
				<i></i>

				<label class="${user.sortAll ? 'checked' : ''}" title="${titles.sortAll}" for="sortAll">
					Sort by overall TO
				</label>
				<input &nbsp;
					id="sortAll"
					class="${_cb}"
					type="checkbox"
					title="${titles.sortAll}"
					name="sort"
					${user.sortAll ? 'checked' : ''}
				/>
				<div id="sortdirs" style="font-size:15px;display:${user.sortPay || user.sortAll ? 'inline' : 'none'}">
					<label class="${user.sortAsc ? 'checked' : ''}" for="sortAsc" title="${titles.sortAsc}">
						&#9650;
					</label>
					<input &nbsp;
						id="sortAsc"
						class="${_cb}"
						type="radio"
						title="${titles.sortAsc}"
						name="sortDir"
						${user.sortAsc ? 'checked' : ''}
					/>
					<label class="${user.sortDsc ? 'checked' : ''}" for="sortDsc" title="${titles.sortDsc}">
						&#9660;
					</label>
					<input &nbsp;
						id="sortDsc"
						class="${_cb}"
						type="radio"
						title="${titles.sortDsc}"
						name="sortDir"
						${user.sortDsc ? 'checked' : ''}
					/>
				</div>
			</p>
			<p>
				Search Terms: &nbsp;
				<input &nbsp;
					id="search"
					title="${titles.search}"
					placeholder="Enter search terms here"
					value="${user.search}"
				/>
				<i></i>
				<label class="${user.hideBlock ? 'checked' : ''}" title="${titles.hideBlock}" for="hideBlock">
					Hide blocklisted
				</label>
				<input &nbsp;
					id="hideBlock"
					class="${_cb}"
					type="checkbox"
					title="${titles.hideBlock}"
					${user.hideBlock ? 'checked' : ''}
				/>
				<i></i>
				<label class="${user.onlyIncludes ? 'checked' : ''}" title="${titles.onlyIncludes}" for="onlyIncludes">
					Restrict to includelist
				</label>
				<input &nbsp;
					id="onlyIncludes"
					class="${_cb}"
					type="checkbox"
					title="${titles.onlyIncludes}"
					${user.onlyIncludes ? 'checked' : ''}
				/>
				<i></i>
				<label class="${user.shineInc ? 'checked' : ''}" title="${titles.shineInc}" for="shineInc">
					Highlight Includelisted
				</label>
				<input &nbsp;
					id="shineInc"
					class="${_cb}"
					type="checkbox"
					title="${titles.shineInc}"
					${user.shineInc ? 'checked' : ''}
				/>
			</p>
		</div>
		<div id="controlbuttons" class="controlpanel" style="margin-top:5px">
			<button id="btnMain">
				Start
			</button>
			<button id="btnHide">
				${phB}
			</button>
			<button id="btnBlocks">
				Edit Blocklist
			</button>
			<button id="btnIncs">
				Edit Includelist
			</button>
			<button id="btnIgnores">
				Toggle Ignored HITs
			</button> &nbsp;
			<button id="btnSettings">
				Settings
			</button>
		</div>
		<div id="loggedout" style="font-size:11px;margin-left:10px;text-transform:uppercase"></div>
		${status$1}
		${table$1.apply(this)}
	`);
	// NOTE: the above commented-out column is the HITDB column
}

function draw$1 () {
	var user = this.user = Settings$1.user,
		fCss =
			`#resultsTable tbody {font-size:${user.fontSize}px;}` +
			`.shine td {border:1px dotted #fff; font-size:${(+user.fontSize) + (+user.shineOffset)}px; font-weight:bold}`,
		head = `<title>${DOC_TITLE}</title>` +
			`<style type="text/css" id="lazyfont">${fCss}</style>` +
			`<style type="text/css">${css}</style>` +
			`<link rel="icon" type="image/png" href="${ico}" /><link rel="stylesheet" type="text/css" />`;

	document.head.innerHTML = head;
	document.body.innerHTML = body.apply(this);
	this.elkeys = Object.keys(titles);
	return this;
}

function getPayload (page = 1) {
	const { user } = Settings$1;
	const payload = {
		legacy: {
			searchWords: user.search,
			minReward: user.reward,
			qualifiedFor: Interface$2.isLoggedout ? 'off' : (user.qual ? 'on' : 'off'),
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
				min_reward: user.reward
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
}

function run (skiptoggle) {
	if (!skiptoggle) this.active = !this.active;

	this.cooldown = Settings$1.user.refresh;
	this.timer = clearTimeout(this.timer);
	Interface$2.resetTitle();

	if (this.active) {
		Interface$2.Status.clear();
		Interface$2.Status.edit('processing', 1);
		Interface$2.Status.show('processing');

		const next = ENV.HOST === ENV.NEXT;
		const path = next ? '/' : '/mturk/searchbar';
		const resType = next ? 'json' : 'document';
		this.fetch(path, this.getPayload(), resType);
	}
}

function cruise (firstTick, tryAgain) {
	if (!this.active) return;

	if (!firstTick && !tryAgain) this.cooldown--;

	if (
		(this.cooldown === 0 || tryAgain) &&
		Settings$1.user.pcQueue &&
		!queueEmpty()
	) {
		reset.apply(this);
		Interface$2.Status.show('queue-wait');

		tryAgain = false;
	}

	if (this.cooldown === 0 || tryAgain) {
		Interface$2.Status.hide('queue-wait');
		this.run(true);
	} else {
		Interface$2.Status.edit('scraping-again', this.cooldown);
		Interface$2.Status.show('scraping-again');

		this.timer = setTimeout(this.cruise.bind(this), 1000);
	}
}

function queueEmpty() {
	let pcData = localStorage.getItem('JR_QUEUE_StoreData');
	if (!pcData) return true;

	const now = Date.now();
	if (now - pcData.date > 30) {
		// pcData is more than 30 seconds old so panda crazy probably isnt open
		return true;
	}

	pcData = JSON.parse(pcData);
	return pcData.queue.length < Settings$1.user.pcQueueMin;
}

function reset() {
	this.cooldown = Settings$1.user.refresh;
	this.timer = clearTimeout(this.timer);
	Interface$2.resetTitle();
	Interface$2.Status.clear();
}

var state = {
	scraperHistory: null,
};

function dispatch (type, src) {
	switch (type) {
		case 'external':
			Interface$2.Status.hide('retrieving-to');
			Interface$2.Status.hide('to-error');
			this.meld(src);
			break;
		case 'internal':
			// if (ENV.HOST === ENV.LEGACY) {
			// 	const error = src.querySelector('td[class="error_title"]');
			// 	if (error && /page request/.test(error.textContent)) {
			// 		return setTimeout(this.fetch.bind(this), 3000, src.documentURI);
			// 	}
			// }
			this.scrapeNext(src);
			break;
		case 'control':
			const numBlocked = state.scraperHistory.filter(v => v.current && v.blocked).length;
			const _rpp = Settings$1.user.resultsPerPage;
			const skiplimit = 5; // max number of pages to skip

			// i tried to make the below mess more readable. don't know if i rewrote it correctly
			// leaving the original for reference
			// const pagelimit = Settings.user.skips
			// 	? ((Settings.user.pages + Math.floor(numBlocked / _rpp) + (numBlocked % _rpp > 0.66 * _rpp
			// 		? 1
			// 		: 0)) || 3)
			// 	: (Settings.user.pages || 3);

			let pagelimit;
			if (Settings$1.user.skips) {
				const magicNumber = (numBlocked % _rpp > 0.66 * _rpp ? 1 : 0);

				pagelimit = Settings$1.user.pages + Math.floor(numBlocked / _rpp) + magicNumber;
				pagelimit = pagelimit || 3;
			} else {
				pagelimit = Settings$1.user.pages || 3;
			}

			if (
				!this.active ||
				!src.nextPageURL ||
				src.page >= pagelimit ||
				(pagelimit - Settings$1.user.pages) >= skiplimit ||
				(Interface$2.isLoggedout && src.page === 20)
			) {
				Interface$2.Status.hide('processing');

				if (Settings$1.user.disableTO) {
					this.meld({});
				} else {
					this.getTO();
				}
			} else {
				Interface$2.Status.edit('processing', +src.page + 1);
				Interface$2.Status.show('processing');

				if (+src.page + 1 > Settings$1.user.pages) {
					Interface$2.Status.show('correcting-skips');
				}

				setTimeout(this.fetch.bind(this), 250, src.nextPageURL, src.payload, src.responseType);
			}
			break;
	}
}

// EvanHahn/HumanizeDuration.js
// https://github.com/EvanHahn/HumanizeDuration.js

function fixTime (...args) {
	function humanizer(passedOptions) {
		var result = function humanizer(ms, humanizerOptions) {
			var options = extend({}, result, humanizerOptions || {});
			return doHumanization(ms, options);
		};

		return extend(result, {
			delimiter: ', ',
			spacer: ' ',
			conjunction: '',
			serialComma: true,
			units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
			round: false,
			unitMeasures: {
				y: 31557600000,
				mo: 2629800000,
				w: 604800000,
				d: 86400000,
				h: 3600000,
				m: 60000,
				s: 1000,
				ms: 1,
			},
		}, passedOptions);
	}

	// The main function is just a wrapper around a default humanizer.
	var humanizeDuration = humanizer({});

	// doHumanization does the bulk of the work.
	function doHumanization(ms, options) {
		var i, len, piece;

		// Make sure we have a positive number.
		// Has the nice sideffect of turning Number objects into primitives.
		ms = Math.abs(ms);

		var dictionary = {
			y: function (c) { return 'year' + (c === 1 ? '' : 's') },
			mo: function (c) { return 'month' + (c === 1 ? '' : 's') },
			w: function (c) { return 'week' + (c === 1 ? '' : 's') },
			d: function (c) { return 'day' + (c === 1 ? '' : 's') },
			h: function (c) { return 'hour' + (c === 1 ? '' : 's') },
			m: function (c) { return 'minute' + (c === 1 ? '' : 's') },
			s: function (c) { return 'second' + (c === 1 ? '' : 's') },
			ms: function (c) { return 'millisecond' + (c === 1 ? '' : 's') },
			decimal: '.',
		};

		var pieces = [];

		// Start at the top and keep removing units, bit by bit.
		var unitName, unitMS, unitCount;
		for (i = 0, len = options.units.length; i < len; i++) {
			unitName = options.units[i];
			unitMS = options.unitMeasures[unitName];

			// What's the number of full units we can fit?
			if (i + 1 === len) {
				unitCount = ms / unitMS;
			} else {
				unitCount = Math.floor(ms / unitMS);
			}

			// Add the string.
			pieces.push({
				unitCount: unitCount,
				unitName: unitName,
			});

			// Remove what we just figured out.
			ms -= unitCount * unitMS;
		}

		var firstOccupiedUnitIndex = 0;
		for (i = 0; i < pieces.length; i++) {
			if (pieces[i].unitCount) {
				firstOccupiedUnitIndex = i;
				break;
			}
		}

		if (options.round) {
			var ratioToLargerUnit, previousPiece;
			for (i = pieces.length - 1; i >= 0; i--) {
				piece = pieces[i];
				piece.unitCount = Math.round(piece.unitCount);

				if (i === 0) { break; }

				previousPiece = pieces[i - 1];

				ratioToLargerUnit = options.unitMeasures[previousPiece.unitName] / options.unitMeasures[piece.unitName];
				if ((piece.unitCount % ratioToLargerUnit) === 0 || (options.largest && ((options.largest - 1) < (i - firstOccupiedUnitIndex)))) {
					previousPiece.unitCount += piece.unitCount / ratioToLargerUnit;
					piece.unitCount = 0;
				}
			}
		}

		var result = [];
		for (i = 0, pieces.length; i < len; i++) {
			piece = pieces[i];
			if (piece.unitCount) {
				result.push(render(piece.unitCount, piece.unitName, dictionary, options));
			}

			if (result.length === options.largest) { break; }
		}

		if (result.length) {
			if (!options.conjunction || result.length === 1) {
				return result.join(options.delimiter);
			} else if (result.length === 2) {
				return result.join(options.conjunction);
			} else if (result.length > 2) {
				return result.slice(0, -1).join(options.delimiter) + (options.serialComma ? ',' : '') + options.conjunction + result.slice(-1);
			}
		} else {
			return render(0, options.units[options.units.length - 1], dictionary, options);
		}
	}

	function render(count, type, dictionary, options) {
		var decimal;
		if (options.decimal === void 0) {
			decimal = dictionary.decimal;
		} else {
			decimal = options.decimal;
		}

		var countStr = count.toString().replace('.', decimal);

		var dictionaryValue = dictionary[type];
		var word;
		if (typeof dictionaryValue === 'function') {
			word = dictionaryValue(count);
		} else {
			word = dictionaryValue;
		}

		return countStr + options.spacer + word;
	}

	function extend(destination) {
		var source;
		for (var i = 1; i < arguments.length; i++) {
			source = arguments[i];
			for (var prop in source) {
				if (source.hasOwnProperty(prop)) {
					destination[prop] = source[prop];
				}
			}
		}
		return destination;
	}

	return humanizeDuration(...args);
}

function scrapeNext (src) {
	Object.keys(state.scraperHistory._cache).forEach(function (gid) {
		// set all hits to .current = false
		// (any hits in results will go back to .current = true below)
		state.scraperHistory.get(gid).current = false;
	});

	src.results.forEach((v, i) => {
		// url .json fix
		v.requester_url = v.requester_url.replace('.json', '');
		v.project_tasks_url = v.project_tasks_url.replace('.json', '');
		v.accept_project_task_url = v.accept_project_task_url.replace('.json', '');

		const data = {
			discovery: Date.now(),
			title: v.title,
			index: src.page_number + ('00' + i).slice(-2),
			requester: { name: v.requester_name, id: v.requester_id, link: ENV.ORIGIN + v.requester_url },
			pay: '$' + v.monetary_reward.amount_in_dollars.toFixed(2),
			payRaw: v.monetary_reward.amount_in_dollars,
			time: v.assignment_duration_in_seconds,
			timeStr: fixTime(v.assignment_duration_in_seconds * 1000).replace(',', ''),
			desc: v.description,
			quals: v.project_requirements.length ? v.project_requirements.map(getQuals) : ['None'],
			hit: { preview: ENV.ORIGIN + v.project_tasks_url, panda: ENV.ORIGIN + v.accept_project_task_url },
			groupId: v.hit_set_id,
			TO: null,
			masters: !!~v.project_requirements.findIndex(q => q.qualification_type_id === '2F1QJWKUDD8XADTFD2Q0G6UTO95ALH'),
			numHits: v.assignable_hits_count,
			blocked: false,
			included: false,
			current: true,
			ignored: false,
			qualified: v.caller_meets_requirements,
			viable: !~v.project_requirements.findIndex(q => q.caller_meets_requirement === false && q.qualification_type.is_requestable === false)
		};

		const listsxr = this.crossRef(data.requester.name, data.title, data.groupId); // checks block/include lists
		data.blocked = listsxr[0];
		data.included = listsxr[1];

		if (
			(
				Settings$1.user.searchBy === enums.searchBy.MOST_AVAILABLE &&
				Settings$1.user.batch > 1 &&
				+data.numHits < Settings$1.user.batch
			) || (
				Settings$1.user.gbatch &&
				Settings$1.user.batch > 1 &&
				+data.numHits < Settings$1.user.batch
			) ||
			Settings$1.user.onlyViable && !data.viable
		) return;

		state.scraperHistory.set(data.groupId, data);
	}, this);

	const dispatchObj = {
		method: 'next',
		page: src.page_number,
		nextPageURL: src.num_results < Settings$1.user.resultsPerPage ? null : '/',
		payload: this.getPayload(src.page_number + 1),
		responseType: 'json'
	};
	this.dispatch('control', dispatchObj);

	function getQuals(qual) {
		return `${qual.qualification_type.name} ${qual.comparator} ${qual.qualification_values.join()}`;
	}
}

function scrape (src) {
	if (ENV.HOST === ENV.NEXT) return this.scrapeNext(src);
	let page = +src.documentURI.match(/pageNumber=(\d+)/)[1],
		nextPageURL = src.querySelector('img[src="/media/right_arrow.gif"]'),
		titles = Array.from(src.querySelectorAll('a.capsulelink')),
		getCapsule = n => {
			for (let i = 0; i < 7; i++) n = n.parentNode;
			return n;
		};
	nextPageURL = nextPageURL ? nextPageURL.parentNode.href : null;

	titles.forEach(function (v, i) {
		let capsule = getCapsule(v),
			get = q => capsule.querySelector(q),
			pad = n => ('00' + n).slice(-2),
			qualrows = Array.prototype.slice.call(get('a[id^="qualifications"]').parentNode.parentNode.parentNode.rows, 1),
			viable = true,
			capData = {
				discovery: Date.now(),
				title: v.textContent.trim(),
				index: page + pad(i),
				requester: { name: get('.requesterIdentity').textContent, id: null, link: null, linkTemplate: null },
				pay: get('span.reward').textContent,
				time: get('a[id^="duration"]').parentNode.nextElementSibling.textContent,
				desc: get('a[id^="description"]').parentNode.nextElementSibling.textContent,
				quals: qualrows.length
					? qualrows.map(v => v.cells[0].textContent.trim().replace(/\s+/g, ' '))
					: ['None'],
				hit: { preview: null, previewTemplate: null, panda: null, pandaTemplate: null },
				groupId: null,
				TO: null,
				masters: null,
				numHits: null,
				blocked: false,
				included: false,
				current: true,
				qualified: !Boolean(get('a[href*="notqualified?"],a[id^="private_hit"]'))
			},
			listsxr = this.crossRef(capData.requester.name, capData.title); //check block/include lists
		capData.blocked = listsxr[0];
		capData.included = listsxr[1];
		capData.masters = /Masters/.test(capData.quals.join());

		if (Interface.isLoggedout) {
			capData.TO = '';
			capData.qualified = false;
			capData.numHits = 'n/a';
		} else {
			viable = !qualrows.map(v => v.cells[2].textContent).filter(v => v.includes('do not')).length;
			capData.numHits = get('a[id^="number_of_hits"]').parentNode.nextElementSibling.textContent.trim();
		}

		try { // groupid
			capData.groupId = get('a[href*="roupId="]').href.match(/[A-Z0-9]{30}/)[0];
		} catch (e) {
			capData.groupId = this.getHash(capData.requester.name + capData.title + capData.pay);
		}
		try { // requesterid, requester search link, groupid
			var _r = get('a[href*="requesterId"]');
			capData.requester.link = _r.href;
			capData.requester.id = _r.href.match(/[^=]+$/)[0];
		} catch (e) {
			capData.requester.link = '/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.requester.name);
		}
		try { // preview/panda links
			var _l = get('a[href*="preview?"]');
			capData.hit.preview = _l.href.split('?')[0] + '?groupId=' + capData.groupId;
			capData.hit.panda = capData.hit.preview.replace(/(\?)/, 'andaccept$1');
		} catch (e) {
			capData.hit.preview = 'https://www.mturk.com/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.title);
		}

		if (Settings$1.user.searchBy === 1 && Settings$1.user.batch > 1 && +capData.numHits < Settings$1.user.batch) return;
		else if (Settings$1.user.gbatch && Settings$1.user.batch > 1 && +capData.numHits < Settings$1.user.batch) return;
		else if (Settings$1.user.onlyViable && !viable) return;
		state.scraperHistory.set(capData.groupId, capData);
	}, this);

	this.dispatch('control', { method: 'legacy', page: page, nextPageURL: nextPageURL });
}

function prepReviews(reviews) {
	const adj = (x, n) => ((x * n + 15) / (n + 5)) - 1.645 * Math.sqrt((Math.pow(1.0693 * x, 2) - Math.pow(x, 2)) / (n + 5));
	Object.keys(reviews).forEach(rid => {
		if (typeof reviews[rid] === 'string') return delete reviews[rid]; // no reviews yet

		//adjust ratings
		let n = 0, d = 0;
		Object.keys(reviews[rid].attrs).forEach(attr => {
			n += reviews[rid].attrs[attr] * Settings$1.user.toWeights[attr];
			d += Settings$1.user.toWeights[attr];
		});
		reviews[rid].attrs.qual = (n / d).toPrecision(4);
		reviews[rid].attrs.adjQual = adj(n / d, +reviews[rid].reviews).toPrecision(4);
		reviews[rid].attrs.adjPay = adj(+reviews[rid].attrs.pay, +reviews[rid].reviews).toPrecision(4);
	});
	return reviews;
}

function bubbleNewHits(results) {
	const _old = [];
	const _new = results.filter(function (hitRow) {
		if (hitRow.shine) return true;

		// not shiny; add to _old
		_old.push(hitRow);
		return false;
	});

	return _new.concat(_old);
}

function setRowColor(hitRow) {
	var ct = Settings$1.user.colorType;
	if (!hitRow.TO || (ct === 'adj' && hitRow.TO.reviews < 5)) {
		// if using adjusted color type, require at least 5 reviews
		hitRow.rowColor = 'toNone';
		return;
	}
	hitRow.rowColor = getClassFromValue(ct === 'sim' ? hitRow.TO.attrs.qual : hitRow.TO.attrs.adjQual, ct);
}

function getClassFromValue(toVal, type) {
	if (type === 'sim') {
		if (toVal > 4) {
			return 'toHigh';
		} else if (toVal > 3) {
			return 'toGood';
		} else if (toVal > 2) {
			return 'toAverage';
		} else {
			return 'toPoor';
		}
	} else {
		if (toVal > 4.05) {
			return 'toHigh';
		} else if (toVal > 3.06) {
			return 'toGood';
		} else if (toVal > 2.4) {
			return 'toAverage';
		} else {
			return 'toPoor';
		}
	}
}

function createTooltip(type, opts) {
	let html;
	let reason;
	if (opts.data) {
		// data is present so skip these ifs
	} else if (Settings$1.user.disableTO) {
		reason = bullet('TO disabled in user settings');
	} else if (opts.loading) {
		reason = bullet('Loading reviews...');
	} else if (opts.error) {
		reason = bullet('Invalid response from server');
	} else {
		reason = bullet('Requester has not been reviewed yet');
	}

	if (reason) {
		html = cleanTemplate(`
			<div class="tooltip" style="width:260px;">
				<p style="padding-left:5px">
					Turkopticon data unavailable:
					${reason}
				</p>
			</div>
		`);
	} else if (type === 'to') {
		html = cleanTemplate(`
			<div class="tooltip" style="width:260px">
				<p style="padding-left:5px">
					<b>${opts.data.name}</b>
					<br />
					Reviews: ${opts.data.reviews} | TOS Flags: ${opts.data.tos_flags}
				</p>
				${genMeters(opts.data)}
			</div>
		`);
		/*<table style="margin-top:6px;width:100%;font-size:10px"><tr><td>Adjusted Pay</td><td>${obj.attrs.adjPay}</td>
		<td>${getClassFromValue(obj.attrs.adjPay, 'adj').slice(2)}</td></tr><tr><td>Weighted Score</td><td>${obj.attrs.qual}</td>
		<td>${getClassFromValue(obj.attrs.qual, 'sim').slice(2)}</td></tr><tr><td>Adjusted Score</td><td>${obj.attrs.adjQual}</td>
		<td>${getClassFromValue(obj.attrs.adjQual, 'adj').slice(2)}</td></tr></table></div>;*/
	} else {
		html = cleanTemplate(`
			<div class="tooltip" style="width:300px">
				<dl>
					<dt>description</dt>
					<dd>${opts.data.desc}</dd>
					<dt>qualifications</dt>
					<dd>${opts.data.quals.join(';')}</dd>
				</dl>
			</div>
		`);
	}

	return html;
}
function bullet(li) {
	return `<ul><li>${li}</li></ul>`;
}
function genMeters(obj) {
	var attrmap = { comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness' };
	var html = [];
	for (var k in attrmap) {
		if (attrmap.hasOwnProperty(k)) {
			html.push(`<meter min="0.8" low="2.5" high="3.4" optimum="5" max="5" value=${obj.attrs[k]} data-attr=${attrmap[k]}></meter>`);
		}
	}
	if (ENV.ISFF) { // firefox is shitty and doesn't support ::after/::before pseudo-elements on meter elements
		html.forEach((v, i, a) => a[i] = '<div style="position:relative">' + v +
			`<span class="ffmb">${attrmap[Object.keys(attrmap)[i]]}</span>` +
			`<span class="ffma">${obj.attrs[Object.keys(attrmap)[i]]}</span></div>`);
	}

	return html.join('');
}

function makeButton(settingName, shortName, longName, data = {}, label = shortName) {
	const settingHidden = Settings$1.user['export' + settingName] ? '' : 'hidden';

	const className = `ex ${shortName.toLowerCase()} ${settingHidden}`;

	data.exporter = shortName.toLowerCase();

	let dataAttr = '';
	Object.keys(data).forEach((key) => {
		const val = data[key];

		dataAttr += `data-${key}="${val}" `;
	});

	return cleanTemplate(`
		<button class="${className}" title="Export HIT to ${longName}" ${dataAttr}>
			${label}
		</button>
	`);
}

function addRowHTML(hitRow, shouldHide, reviewsError, reviewsLoading) {
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
						${hitRow.title + createTooltip('hit', titleTooltipData)}
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
					${(hitRow.TO ? hitRow.TO.attrs.pay : 'n/a') + createTooltip('to', toTooltipData)}
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

function meld (reviews) {
	let reviewsError = reviews.error;
	let reviewsLoading = reviews.loading;
	if (reviewsError || reviewsLoading) reviews = {};

	let noReviews = false;
	if (isEmptyObj(reviews)) noReviews = true;

	if (!noReviews) state.scraperHistory.updateTOData(prepReviews(reviews));

	const table = document.querySelector('#resultsTable').tBodies[0];
	const html = [];
	const results = state.scraperHistory.filter((hit) => {
		if (!hit.current) return false;
		if (Settings$1.user.mhide && hit.masters) return false;

		return true;
	});

	// sorting
	if (
		!Interface$2.isLoggedout &&
		!Settings$1.user.disableTO &&
		Settings$1.user.sortPay !== Settings$1.user.sortAll
	) {
		let field;
		if (Settings$1.user.sortPay) {
			field = Settings$1.user.sortType === 'sim' ? 'pay' : 'adjPay';
		} else if (Settings$1.user.sortAll) {
			field = Settings$1.user.sortType === 'sim' ? 'qual' : 'adjQual';
		}

		results.sort((hitRow1, hitRow2) => {
			const hitRow1SortVal = hitRow1.TO ? +hitRow1.TO.attrs[field] : 0;
			const hitRow2SortVal = hitRow2.TO ? +hitRow2.TO.attrs[field] : 0;

			return hitRow2SortVal - hitRow1SortVal;
		});

		if (Settings$1.user.sortAsc) results.reverse();
	} else {
		results.sort((a, b) => a.index - b.index);
	}

	// populating
	const counts = {
		total: results.length,
		new: 0,
		newVis: 0,
		ignored: 0,
		blocked: 0,
		included: 0,
		includedNew: 0,
	};
	for (let hitRow of (Settings$1.user.bubbleNew ? bubbleNewHits(results) : results)) {
		const shouldHide = Boolean(
			(Settings$1.user.hideBlock && hitRow.blocked) ||
			(Settings$1.user.hideNoTO && !hitRow.TO) ||
			(Settings$1.user.minTOPay && hitRow.TO && +hitRow.TO.attrs.pay < Settings$1.user.minTOPay)
		);

		counts.new += hitRow.isNew ? 1 : 0;
		counts.newVis += hitRow.isNew && !shouldHide ? 1 : 0;
		counts.ignored += shouldHide ? 1 : 0;
		counts.blocked += hitRow.blocked ? 1 : 0;
		counts.included += hitRow.included ? 1 : 0;
		counts.includedNew += hitRow.included && hitRow.isNew ? 1 : 0;
		setRowColor(hitRow);
		html.push(addRowHTML(hitRow, shouldHide, reviewsError, reviewsLoading));
	}
	table.innerHTML = html.join('');
	this.notify(counts, reviewsLoading);

	if (this.active) {
		if (this.cooldown === 0) {
			Interface$2.buttons.main.click();
		} else if (!this.timer && (!Settings$1.user.asyncTO || noReviews)) {
			this.cruise(true);
		}
	}

	if (!Settings$1.user.asyncTO || !noReviews) {
		// theres probably an edge case where there are 0 results where this will break
		this.lastScrape = Date.now();
	}
}

function isEmptyObj(val) {
	if (typeof val !== 'object' || Array.isArray(val)) return false;

	return Object.keys(val).length === 0;
}

function getHash (str) {
	var hash = 0, ch;
	for (var i = 0; i < str.length; i++) {
		ch = str.charCodeAt(i);
		hash = ch + (hash << 6) + (hash << 16) - hash;
	}
	return hash;
}

function fetch (url, payload, responseType, inline = true) {
	const enc = window.encodeURIComponent;
	responseType = responseType || 'document';

	if (payload) {
		const key = ENV.HOST === ENV.NEXT ? 'next' : 'legacy';
		payload = payload[key];
		url += '?' + Object.entries(payload).map(stringify).join('&');
	}

	const isTO = url.split('?')[0].includes('turkopticon');

	function stringify(v) {
		const predicate = typeof v[1] !== 'string' && !(v[1] instanceof Array) ? Object.entries(v[1]) : '';
		if (predicate.length)
			return predicate.map(vp => (vp[0] = enc(`${v[0]}[${vp[0]}]`)) && vp) // 0 = o[i] => o%5Bi%5D
				.map(stringify)
				.join('&');
		return `${v[0]}=${enc(v[1])}`;
	}

	const _p = new Promise(function (resolve, reject) {
		let timeout = 3 * 1000;
		if (isTO) {
			timeout = Settings$1.user.toTimeout * 1000;

			// good for debugging (errors immediately, set to https otherwise):
			// url = 'http://httpstat.us/200?sleep=50000';
		}

		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = responseType;
		xhr.timeout = timeout;
		xhr.send();
		xhr.onload = function () {
			if (this.status === 200) {
				resolve(this.response);
			} else {
				reject(new Error(this.status + ' - ' + this.statusText));
			}
		};
		xhr.onerror = function () {
			reject(new Error(this.status + ' - ' + this.statusText));
			console.log('error: ', this);
		};
		xhr.ontimeout = function () {
			reject(new Error('Request timed out - ' + url));
			console.log('timeout: ', this);
		};
	});

	if (inline) {
		const type = isTO ? 'external' : 'internal';

		_p.then(this.dispatch.bind(this, type), err => {
			console.warn(err);

			Interface$2.Status.hide('retrieving-to');
			Interface$2.Status.show('to-error');

			this.meld.apply(this, [{ error: true }]);
		});
	} else {
		return _p;
	}
}

function crossRef (...needles) {
	var found = [false, false];
	var s;
	if (Settings$1.user.onlyIncludes) { // everything not in includelist gets blocked, unless includelist is empty or doesn't exist
		var list = (localStorage.getItem(INCLUDE_KEY) || '').toLowerCase().split('^');
		if (list.length === 1 && !list[0].length) return found; // includelist is empty
		for (s of needles) {
			found[1] = Boolean(~list.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
			if (found[1]) {
				found[0] = false;
				break;
			} else
				found[0] = true;
		}
	} else {
		if (localStorage.getItem(IGNORE_KEY) === null) {
			new Editor$1().setDefaultBlocks();
		}

		const blist = (localStorage.getItem(IGNORE_KEY) || '').toLowerCase().split('^');
		const ilist = (localStorage.getItem(INCLUDE_KEY) || '').toLowerCase().split('^');
		const blist_wild = Settings$1.user.wildblocks ? blist.filter(v => /.*?[*].*/.test(v)) : null;

		if (blist_wild) {
			blist_wild.forEach((v, i, a) => {
				let regex = v;
				regex = regex.replace(/([+${}[\](\)^|?.\\])/g, '\\$1'); // escape non wildcard special chars
				regex = regex.replace(/([^*]|^)[*](?!\*)/g, '$1.*'); // turn glob into regex
				regex = regex.replace(/\*{2,}/g, s => s.replace(/\*/g, '\\$&')); // escape consecutive asterisks

				a[i] = new RegExp('^' + regex + '$', 'i'); // escape consecutive asterisks
			});
		}
		for (s of needles) {
			found[0] = found[0] || Boolean(~blist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
			found[1] = found[1] || Boolean(~ilist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));

			if (blist_wild && blist_wild.length && !found[0]) {
				for (var i = 0; !found[0] && i < blist_wild.length; i++) {
					found[0] = blist_wild[i].test(s.toLowerCase().replace(/\s+/g, ' '));
				}
			}
		}
	}
	return found; // [ blocklist,includelist ]
}

function notify$1 (c, loading) {
	var s = [];
	s.push(c.total > 0 ? `${c.total} HIT${c.total > 1 ? 's' : ''}` : '<b>No HITs found.</b>');
	if (c.new) s.push(`<i></i>${c.new} new`);
	if (c.newVis !== c.new) s.push(` (${c.newVis} shown)`);
	if (c.included) s.push(`<i></i><b>${c.included} from includelist</b>`);
	if (c.ignored) s.push(`<i></i>${c.ignored} hidden -- `);
	if (c.blocked) s.push(`${c.ignored ? '' : '<i></i>'}${c.blocked} from blocklist`);
	if (c.ignored - c.blocked > 0) s.push(`${c.blocked
		? '<i></i>'
		: ''}${c.ignored - c.blocked} below TO threshold`);

	Interface$2.Status.show('scrape-complete');
	Interface$2.Status.edit('scrape-complete', s.join(''));

	if (c.newVis && Settings$1.user.notifySound[0] && !loading) {
		document.getElementById(Settings$1.user.notifySound[1]).play();
	}
	if (!c.newVis || Interface$2.focused || loading) return;

	document.title = `[${c.newVis} new]` + DOC_TITLE;
	if (Settings$1.user.notifyBlink) Interface$2.blackhole.blink =
		setInterval(() => document.title = /scraper/i.test(document.title)
			? `${c.newVis} new HITs`
			: DOC_TITLE, 1000);
	if (Settings$1.user.notifyTaskbar && Notification.permission === 'granted') {
		var inc = c.incNew ? ` (${c.incNew} from includelist)` : '',
			n = new Notification('HITScraper found ' + c.newVis + ' new HITs' + inc);
		n.onclick = n.close;
		setTimeout(n.close.bind(n), 5000);
	}
}

function getTO () {
	const ids = state.scraperHistory.filter(v => v.current && !v.TO && !v.blocked && v.requester.id, true)
		.filter((v, i, a) => a.indexOf(v) === i).join();

	if (!ids.length) return this.meld({});

	if (Settings$1.user.asyncTO) {
		// go ahead and show the results without ratings
		this.meld({ loading: true });
	}

	Interface$2.Status.show('retrieving-to');

	this.fetch(TO_API + ids, null, 'json');
}

class Core {
	constructor() {
		this.active = false;
		this.timer = null;
		this.cooldown = null;
		this.lastScrape = null;
		this.canRetryTO = true;

		this.getPayload = getPayload.bind(this);
		this.run = run.bind(this);
		this.cruise = cruise.bind(this);
		this.dispatch = dispatch.bind(this);
		this.scrapeNext = scrapeNext.bind(this);
		this.scrape = scrape.bind(this);
		this.meld = meld.bind(this);
		this.getHash = getHash.bind(this);
		this.fetch = fetch.bind(this);
		this.crossRef = crossRef.bind(this);
		this.notify = notify$1.bind(this);
		this.getTO = getTO.bind(this);
	}
}
var Core$1 = new Core();

function init$1 () {
	this.panel = {};
	this.buttons = {};
	var get = (q, all) => document['querySelector' + (all ? 'All' : '')](q),
		sortdirs = get('#sortdirs'),
		moveSortdirs = function (node) {
			if (!node.checked) {
				sortdirs.style.display = 'none';
				return;
			}
			sortdirs.style.display = 'inline';
			sortdirs.remove();
			node.parentNode.insertBefore(sortdirs, node.nextSibling);
		},
		kdFn = e => { if (e.keyCode === kb.ENTER) setTimeout(() => this.buttons.main.click(), 30); },
		optChangeFn = function (e) {
			var tag = e.target.tagName, type = e.target.type, id = e.target.id,
				isChecked = e.target.checked, name = e.target.name, value = e.target.value;

			switch (tag) {
				case 'SELECT': {
					if (id === 'soundSelect')
						this.user.notifySound[1] = e.target.value;
					else
						this.user[id] = e.target.selectedIndex;
					break;
				}
				case 'INPUT': {
					switch (type) {
						case 'number': {
							this.user[id] = +value;
							break;
						}
						case 'text': {
							this.user[id] = value;
							break;
						}
						case 'radio': {
							Array.from(get(`input[name=${name}]`, true))
								.forEach(v => {
									this.user[v.id] = v.checked;
									get(`label[for=${v.id}]`).classList.toggle('checked');
								});
							break;
						}
						case 'checkbox': {
							if (name === 'sort') {
								Array.from(get(`input[name=${name}]`, true)).forEach(v => {
									if (e.target !== v) v.checked = false;
									get(`label[for=${v.id}]`).className = v.checked ? 'checked' : '';
									this.user[v.id] = v.checked;
								});
								moveSortdirs(e.target);
								break;
							} else if (id === 'sound') {
								this.user.notifySound[0] = isChecked;
								e.target.nextElementSibling.style.display = isChecked ? 'inline' : 'none';
							}
							this.user[id] = isChecked;
							get(`label[for=${id}]`).classList.toggle('checked');
							break;
						}
					}
					break;
				}
			}
			Settings$1.save();
		}.bind(this);

	'ding squee'.split(' ').forEach(v => get(`#${v}`).volume = this.user.volume[v]);

	Themes$1.apply(this.user.themes.name);
	if (this.isLoggedout) get('#loggedout').textContent = 'you are currently logged out of mturk';
	// get references to control panel elements and set up click events
	this.Status = {
		node: get('#status'),
		show: function (name) {
			this.node.querySelector(`#status-${name}`).classList.remove('hidden');
		},
		hide: function (name) {
			this.node.querySelector(`#status-${name}`).classList.add('hidden');
		},
		edit: function (name, value) {
			this.node.querySelector(`#status-${name} span`).innerHTML = value;
		},
		clear: function () {
			Array.from(this.node.querySelectorAll('[id^="status-"]')).forEach(function (el) {
				el.classList.add('hidden');
			});
		},
	};
	for (var k of this.elkeys) {
		if (k === 'mainlink') continue;
		this.panel[k] = document.getElementById(k);
		this.panel[k].onchange = optChangeFn;
		if (k === 'pay' || k === 'search') this.panel[k].onkeydown = kdFn;
		if ((k === 'sortPay' || k === 'sortAll') && this.panel[k].checked) moveSortdirs(this.panel[k]);
	}

	// get references to buttons
	Array.from(get('button', true)).forEach(v => this.buttons[v.id.slice(3).toLowerCase()] = v);
	// set up button click events
	this.buttons.main.onclick = function (e) {
		e.target.textContent = e.target.textContent === 'Start' ? 'Stop' : 'Start';
		Core$1.run();
	};
	this.buttons.retryto.onclick = function (e) {
		if (!Core$1.canRetryTO) return;
		Core$1.canRetryTO = false;

		e.target.classList.add('disabled');
		Core$1.getTO();
		setTimeout(function () {
			Core$1.canRetryTO = true;
			e.target.classList.remove('disabled');
		}, 3000);
	};
	this.buttons.retryqueue.onclick = function (e) {
		if (!Settings$1.user.pcQueue) return;

		Core$1.cruise(false, true);
	};
	this.buttons.hide.onclick = function (e) {
		get('#controlpanel').classList.toggle('hiddenpanel');
		e.target.textContent = e.target.textContent === 'Hide Panel' ? 'Show Panel' : 'Hide Panel';

		Settings$1.user.hidePanel = !Settings$1.user.hidePanel;
		Settings$1.save();
	};
	this.buttons.blocks.onclick = () => {
		this.toggleOverflow('on'); // TODO what does this do?
		new Editor$1('ignore');
	};
	this.buttons.incs.onclick = () => {
		this.toggleOverflow('on');
		new Editor$1('include');
	};
	this.buttons.ignores.onclick = () => {
		Array.from(get('.ignored:not(.blocklisted)', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	};
	this.buttons.settings.onclick = () => {
		this.toggleOverflow('on');
		Settings$1.draw().init();
	};
	get('#disableTO').addEventListener('change', (e) => {
		if (e.target.checked) {
			this.Status.hide('to-error');
		}
	});
	get('#hideBlock').addEventListener('change', () => {
		Array.from(get('.blocklisted', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	get('#hideNoTO').addEventListener('change', () => {
		Array.from(get('.toNone', true)).forEach(v => {
			v.classList.toggle('hidden');
		});
	});
	document.body.onblur = () => this.focused = false;
	document.body.onfocus = () => {
		this.focused = true;
		this.resetTitle();
	};
}

class Interface$1 {
	constructor() {
		this.user = Settings$1.user;
		this.time = Date.now();
		this.focused = true;
		this.blackhole = {};
		this.isLoggedout = false; // TODO broken on new site; looking for alternative

		this.resetTitle = resetTitle.bind(this);
		this.toggleOverflow = toggleOverflow.bind(this);
		this.draw = draw$1.bind(this);
		this.init = init$1.bind(this);
	}
}
var Interface$2 = new Interface$1();

function hwtf () {
	var _location = 'ICA';
	var _quals;
	var _masters = '';
	var _title;
	var _r = this.record;
	var tIndex;
	// format qualifications string
	_quals = _r.quals.map(v => {
		if (/(is US|: US$)/.test(v))
			_location = 'US';
		else if (/Masters/.test(v))
			_masters = `[${v.match(/.*Masters/)[0].toUpperCase()}]`;
		else if (/approv[aled]+ (rate|HITs)/.test(v))
			return v.replace(/.+ is (.+) than (\d+)/, (_, p1, p2) => {
				if (/^(not g|less)/.test(p1)) return '<' + p2 + (/%/.test(_) ? '%' : '');
				else if (/^(not l|greater)/.test(p1)) return '>' + p2 + (/%/.test(_) ? '%' : '');
				else console.error('match error', [_, p1, p2]);
				return _;
			});
		else
			return v;
	}).filter(v => v).sort(a => /[><]/.test(a) ? -1 : 1);
	_title = `${_location} - ${_r.title} - ${_r.requester.name} - ${_r.pay}/COMTIME - (${_quals.join(', ') || 'None'}) ${_masters}`;
	tIndex = _title.search(/COMTIME/);
	this.node.style.whiteSpace = 'nowrap';
	this.node.innerHTML = '<p style="width:500px;white-space:normal">' +
		'/r/HitsWorthTurkingFor Export: Use the buttons on the left for single-click copying. ' +
		'Before you post, please remember to replace "COMTIME" with how long it took you to complete the HIT.</p>' +
		'<button class="exhwtf" style="height:65px">Title</button>' +
		'<textarea style="padding:2px;margin:auto;height:60px;width:430px;resize:none" tabindex="1" autofocus>' +
		_title + '</textarea><br />' + '<button class="exhwtf" style="height:35px">Preview</button>' +
		'<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="2">' +
		'Preview: ' + _r.hit.preview + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">Req</button>' +
		'<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="3">' +
		'Req: ' + _r.requester.link + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">PandA</button>' +
		'<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="4">' +
		'PandA: ' + _r.hit.panda + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">TO</button>' +
		'<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="5">' +
		'TO: ' + TO_REPORTS + _r.requester.id + '</textarea><br />' +
		'<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>';

	var copyfn = function (e) {
		e.target.nextSibling.select();
		document.execCommand('copy');
	};
	Array.from(this.node.querySelectorAll('.exhwtf')).forEach(v => v.onclick = copyfn);
	this.node.querySelector('#exClose').onclick = this.die.bind(this);
	this.node.querySelector('textarea').setSelectionRange(tIndex, tIndex + 7);
}

function vb () {
	var
		getColor = attr => {
			switch (attr) {
				case 5:
				case 4:
					return 'green';
				case 3:
					return 'yellow';
				case 2:
					return 'orange';
				case 1:
					return 'red';
				default:
					return 'white';
			}
		},
		templateVars = {
			title: this.record.title,
			requesterName: this.record.requester.name,
			requesterLink: this.record.requester.link,
			requesterId: this.record.requester.id,
			description: this.record.desc,
			reward: this.record.pay,
			quals: this.record.quals.join(';').replace(/(;?)(\w* ?Masters.+?)(;?)/g, '$1[COLOR=red][b]$2[/b][/COLOR]$3'),
			previewLink: this.record.hit.preview,
			pandaLink: this.record.hit.panda,
			time: this.record.time,
			numHits: this.record.numHits,
			toImg: '', // deprecated
			toCompact: (function () {
				var _to = this.record.TO, txt = ['[b]'], color;
				if (!_to) return 'TO Unavailable';
				for (var a of ['comm', 'pay', 'fair', 'fast']) {
					color = getColor(Math.floor(_to.attrs[a]));
					txt.push(`[ ${a}: [COLOR=${color}]${_to.attrs[a]}[/COLOR] ]`);
				}
				return txt.join('') + '[/b]';
			}).apply(this),// toCompact
			toVerbose: (function () {
				var _to = this.record.TO, txt = [], color, _attr, sym = Settings$1.user.vbSym,
					_long = { comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness' };
				if (!_to) return 'TO Unavailable';
				for (var a of ['comm', 'pay', 'fair', 'fast']) {
					_attr = Math.floor(_to.attrs[a]);
					color = getColor(_attr);
					txt.push((_attr > 0 ? (`[COLOR=${color}]${sym.repeat(_attr)}[/COLOR]` + (_attr < 5
						? `[COLOR=white]${sym.repeat(5 - _attr)}[/COLOR]`
						: ''))
						: '[COLOR=white]' + sym.repeat(5) + '[/COLOR]') + ` ${_to.attrs[a]} ${_long[a]}`);
				}
				return txt.join('\n');
			}).apply(this),// toText
			toFoot: (function () {
				var _to = this.record.TO,
					payload = `requester[amzn_id]=${this.record.requester.id}&requester[amzn_name]=${this.record.requester.name}`,
					newReview = `[URL="${TO_BASE + 'report?' + payload}"]Submit a new TO review[/URL]`;
				if (!_to) return newReview;
				return `Number of Reviews: ${_to.reviews} | TOS Flags: ${_to.tos_flags}\n` + newReview;
			}).apply(this)// toFoot
		},// templateVars obj
		createTemplate = function (str) {
			/*jshint -W054*/ // ignore evil due to required eval (function constructor)
			// TODO: find a concise way to dynamically generate a template without using eval
			var _str = str.replace(/\$\{ *([-\w\d.]+) *\}/g, (_, p1) => `\$\{vars.${p1}\}`);
			return new Function('vars', `try {return \`${_str}\`} catch(e) {return "Error in template: "+e.message}`);
		};
	templateVars.toText = templateVars.toVerbose; // temporary backwards compatibility
	this.node.innerHTML = '<p>vB Export</p>' +
		'<textarea style="display:block;padding:2px;margin:auto;height:250px;width:500px" tabindex="1">' +
		createTemplate(Settings$1.user.vbTemplate)(templateVars) + '</textarea>' +
		'<button id="exTemplate" style="margin-top:5px;width:50%;color:white;background:black">Edit Template</button>' +
		'<button id="exClose" style="margin-top:5px;width:50%;color:white;background:black">Close</button>';
	this.node.querySelector('#exTemplate').onclick = () => {
		this.die();
		new Editor('vbTemplate', this.target);
	};
	this.node.querySelector('#exClose').onclick = this.die.bind(this);
	this.node.querySelector('textarea').select();
}

function irc () {
	// custom MTurk/TO url shortener courtesy of Tjololo
	var api = 'https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959',
		urlArr = [], payload, sym = '\u2022', // sym = bullet
		getTO = () => {
			var _to = this.record.TO;
			if (!_to) return 'Unavailable';
			else return `Pay=${_to.attrs.pay} Fair=${_to.attrs.fair} Comm=${_to.attrs.comm}`;
		};

	urlArr.push(window.encodeURIComponent(this.record.requester.link));
	urlArr.push(window.encodeURIComponent(this.record.hit.preview));
	urlArr.push(window.encodeURIComponent(TO_REPORTS + this.record.requester.id));
	urlArr.push(window.encodeURIComponent(this.record.hit.panda));
	payload = '&urls[]=' + urlArr.join('&urls[]=');

	this.node.innerHTML = '<span style="font-size:16px">Shortening URLs... <i class="spinner"></i></span>';
	Core$1.fetch(api + payload, null, 'text', false).then(r => {
		urlArr = r.split(';').slice(0, 4);
		this.node.innerHTML = '<p>IRC Export</p>' +
			'<textarea style="display:block;padding:2px;margin:auto;height:130px;width:500px" tabindex="1">' +
			(/masters/i.test(this.record.quals.join()) ? `MASTERS ${sym} ` : '') +
			`Requester: ${this.record.requester.name} ${urlArr[0]} ${sym} HIT: ${this.record.title} ` +
			`${urlArr[1]} ${sym} Pay: ${this.record.pay} ${sym} Avail: ${this.record.numHits} ${sym} ` +
			`Limit: ${this.record.time} ${sym} TO: ${getTO()} ${urlArr[2]} ${sym} PandA: ${urlArr[3]}</textarea>` +
			'<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>';
		this.node.querySelector('textarea').select();
		this.node.querySelector('#exClose').onclick = this.die.bind(this);
	}, err => {
		console.error(err);
		this.die();
	});
}

function time24To12(hours) {
	return ((hours + 11) % 12 + 1);
}
function amORpm(hour) {
	if (hour >= 12) return 'PM';

	return 'AM';
}

/**
 * Returns a formatted date
 */

function makeTitle(hit) {
	let deleteTime = '';
	if (hit.time) {
		const now = new Date();

		const deleteDate = new Date();
		deleteDate.setHours(+hit.formattedPostDate.substr(-5, 2));
		deleteDate.setMinutes(+hit.formattedPostDate.substr(-2, 2));

		// should delete watcher after 2.25 times the hit's duration since it was posted
		deleteDate.setMilliseconds(hit.timeMS * 2.25);

		let day = '';
		if (deleteDate.getDate() !== now.getDate()) {
			day = `${deleteDate.getMonth() + 1}/${deleteDate.getDate()}-`;
		}

		const hours = pad(2, time24To12(deleteDate.getHours()));
		const minutes = pad(2, deleteDate.getMinutes());
		const ampm = amORpm(deleteDate.getHours());

		deleteTime = `[${day}${hours}:${minutes} ${ampm}] -- `;
	}

	let pay = '';
	if (hit.pay) {
		pay = hit.pay + ' -- ';
	}

	let title = hit.title.trim();
	// let title = hit.title.substr(0, 35).trim();
	if (title.length < hit.title.length) {
		title += '...';
	}

	return deleteTime + pay + title;
}

function pandaCrazy$1 (type) {
	const msgData = {
		time: (new Date()).getTime(),
		command: 'add' + type + 'Job',
		data: {
			groupId: this.record.groupId,
			title: makeTitle(convertObj(this.record)),
			requesterName: this.record.requester.name,
			requesterId: this.record.requester.id,
			pay: +this.record.pay.replace('+', '').replace('$', ''),
			duration: this.record.timeStr,
			hitsAvailable: this.record.numHits,
		},
	};
	localStorage.setItem('JR_message_pandacrazy', JSON.stringify(msgData));

	this.die();
}

function convertObj(hit) {
	// returns an obj in the format that makeTitle expects
	const now = new Date();
	const month = pad(2, now.getMonth() + 1);
	const day = pad(2, now.getDate());
	const year = now.getFullYear();

	const hour = pad(2, now.getHours());
	const minute = pad(2, now.getMinutes());

	const dateStr = `${month} ${day}, ${year} ${hour}:${minute}`;

	const newObj = {
		title: hit.title,
		pay: hit.pay + (/bonus/i.test(hit.title) ? '+' : ''), // check if bonus in title
		time: hit.timeStr,
		timeMS: hit.time * 1000, // hit.time is in seconds; x1000 to get ms
		formattedPostDate: dateStr,
	};

	return newObj;
}

class Exporter {
	constructor(e) {
		Interface$2.toggleOverflow('on');

		this.target = e.target;
		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.classList.add('pop');
		this.record = state.scraperHistory.get(this.target.dataset.gid);

		if (Interface$2.isLoggedout) return this.die();

		const exports = {
			hwtf: hwtf.bind(this),
			vb: vb.bind(this),
			irc: irc.bind(this),
			'pc-p': pandaCrazy$1.bind(this, ''), // Panda mode
			'pc-o': pandaCrazy$1.bind(this, 'Once'), // Once mode
		};
		const exportName = this.target.dataset.exporter;
		exports[exportName]();
	}
	die() {
		Interface$2.toggleOverflow('off');
		this.node.remove();
	}
}

class Dialogue {
	constructor(caller) {
		this.caller = caller;

		Interface$2.toggleOverflow('on');

		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.style.cssText = cleanTemplate(`
			position: fixed;
			z-index: 20;
			top: 15%;
			left: 50%;
			width: 320px;
			padding: 20px;
			transform: translate(-50%);
			background: #000;
			color: #fff;
			box-shadow: 0px 0px 6px 1px #fff;
		`);

		let blockType;
		if (this.caller.textContent === 'R') blockType = 'requester';
		else if (this.caller.textContent === 'T') blockType = 'title';
		else if (this.caller.textContent === 'ID') blockType = 'Group ID';

		this.node.innerHTML = cleanTemplate(`
			<p>
				<b>Add this ${blockType} to the blocklist?</b>
			</p>
			<p>
				"${this.caller.value}"
			</p>
      <div style="text-align:right;margin-right:30px;margin-top:10px;padding-top:10px">
				<button id="confirm" style="font-weight:bold;padding:7px;width:65px">
					OK
				</button>
				<button id="cancel" style="padding:7px;width:65px;">
					Cancel
				</button>
			</div>
		`);

		this.node.querySelector('#confirm').onclick = this.confirm.bind(this);
		this.node.querySelector('#cancel').onclick = this.die.bind(this);
		this.node.addEventListener('keydown', e => {
			if (e.keyCode === kb.ESC)
				this.die();
		}, true);
		this.node.querySelector('#confirm').focus();
	}
	die() {
		Interface$2.toggleOverflow('off');
		this.node.remove();
	}
	confirm() {
		const { value } = this.caller;
		const blockStr = value.toLowerCase().replace(/\s+/g, ' ');

		let blocklist = localStorage.getItem(IGNORE_KEY);
		if (!blocklist) {
			blocklist = blockStr;
		} else if (blocklist.slice(-1) === '^') {
			blocklist += blockStr;
		} else {
			blocklist += '^' + blockStr;
		}

		localStorage.setItem(IGNORE_KEY, blocklist);

		Array.from(document.querySelectorAll('#resultsTable tbody tr')).forEach(v => {
			const gid = v.querySelector('.ex').dataset.gid;
			const rName = state.scraperHistory.get(gid).requester.name;
			const title = state.scraperHistory.get(gid).title;

			if (
				v.classList.contains('blocklisted') ||
				!eq(rName, value) && !eq(title, value) && !eq(gid, value)
			) return;

			state.scraperHistory.get(gid).blocked = true;

			v.cells[0].firstChild.remove();
			return v.classList.add('blocklisted') || Settings$1.user.hideBlock && v.classList.add('hidden');
		});
		this.die();
	}
}
function eq(str1, str2) {
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	return str1 === str2;
}

class Cache {
	constructor(limit = 500) {
		this.limit = limit;
		this._length = 0;
		this._cache = Object.create(null);
		this._tmp = Object.create(null);
	}

	get(key) {
		let val = this._cache[key];

		if (val) {
			return val;
		} else if (this._tmp[key]) {
			val = this._tmp[key];

			return this._update(key, val);
		} else {
			return null;
		}
	}

	set(key, value) {
		if (this._cache[key]) {
			// key is already in cache; change it
			this._cache[key] = value;

			return this._cache[key];
		} else {
			// key isn't in cache yet
			this._update(key, value);
		}
	}

	has(key) {
		return !!this.get(key);
	}

	_update(key, value) {
		this._cache[key] = value;
		this._length++;

		if (this._length > this.limit) {
			this._tmp = this._cache;
			this._cache = Object.create(null);
			this._length = 0;
		}

		return value;
	}
}

class TOCache extends Cache {
	setBatch(reviews) {
		if (!reviews) return null;

		Object.keys(reviews).forEach((rid) => this._update(rid, reviews[rid]));
		return reviews;
	}
}

class ScraperCache extends Cache {
	constructor(limit = 500) {
		super(limit);
		this._toCache = new TOCache();
	}

	set(key, value) {
		if (
			Settings$1.user.cacheTO &&
			!value.TO &&
			value.requester.id &&
			this._toCache.has(value.requester.id)
		) {
			value.TO = this._toCache.get(value.requester.id);
		}
		const isFirstScrape = !Core$1.lastScrape;
		if (this.get(key)) { // exists
			const age = Math.floor((Date.now() - this._cache[key].discovery) / 1000);
			const obj = {
				isNew: false,
				shine: this._cache[key].shine && age < Settings$1.user.shine && !isFirstScrape,
			};

			value.discovery = this._cache[key].discovery;
			return (this._cache[key] = Object.assign(value, obj));
		} else { // new
			const obj = {
				isNew: !isFirstScrape,
				shine: !isFirstScrape,
				TO: this._toCache.get(value.requester.id),
			};

			return this._update(key, Object.assign(value, obj));
		}
	}

	filter(callback, rids = false) {
		const results = [];
		const keys = Object.keys(this._cache);

		Object.keys(this._cache).forEach((key) => {
			const val = this.get(key);

			if (callback(val, key, this._cache)) {
				results.push(rids ? val.requester.id : val);
			}
		});

		return results;
	}

	updateTOData(reviews) {
		this._toCache.setBatch(reviews);

		this.filter(v => v.current && v.TO === null).forEach((group) => {
			if (this._toCache.has(group.requester.id)) {
				this._cache[group.groupId].TO = this._toCache.get(group.requester.id);
			}
		});
	}
}

console.log('HS hook');
if (!document.getElementById('control_panel')) {
	initialize();

	const rt = document.getElementById('resultsTable');
	delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseover', tomouseover);
	delegate(rt, 'tr:not(hidden) .toLink, tr:not(hidden) .hit-title', 'mouseout', tomouseout);
	delegate(rt, 'tr:not(hidden) .ex', 'click', e => new Exporter(e));
	delegate(rt, 'tr:not(hidden) button[name=block]', 'click', ({ target }) => new Dialogue(target));
}

function initialize() {
	Settings$1.user = Object.assign({}, Settings$1.defaults, JSON.parse(localStorage.getItem(SETTINGS_KEY)));
	Interface$2.draw().init();
	state.scraperHistory = new ScraperCache(650);
}

function tomouseover(e) {
	const tt = e.target.parentElement.querySelector('.tooltip');
	tt.style.display = 'block';
	const rect = tt.getBoundingClientRect();
	if (rect.height > (window.innerHeight - e.clientY)) {
		tt.style.transform = 'translateY(calc(-100% + 22px))';
	}
	if (rect.x < 0) {
		const width = +tt.style.width.replace('px', '') - 3;
		tt.style.width = (width + rect.x) + 'px';
	} else {
		tt.style.width = '300px';
	}
}

function tomouseout(e) {
	const tt = e.target.parentElement.querySelector('.tooltip');
	if (!tt) return;

	tt.style.transform = '';
	tt.style.display = 'none';
}

return initialize;

}());
