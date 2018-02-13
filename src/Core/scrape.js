import { ENV } from '../lib/constants';
import Settings from '../Settings/index';
import state from '../lib/state';

export default function (src) {
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
			void (e);
			capData.groupId = this.getHash(capData.requester.name + capData.title + capData.pay);
		}
		try { // requesterid, requester search link, groupid
			var _r = get('a[href*="requesterId"]');
			capData.requester.link = _r.href;
			capData.requester.id = _r.href.match(/[^=]+$/)[0];
		} catch (e) {
			void (e);
			capData.requester.link = '/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.requester.name);
		}
		try { // preview/panda links
			var _l = get('a[href*="preview?"]');
			capData.hit.preview = _l.href.split('?')[0] + '?groupId=' + capData.groupId;
			capData.hit.panda = capData.hit.preview.replace(/(\?)/, 'andaccept$1');
		} catch (e) {
			void (e);
			capData.hit.preview = 'https://www.mturk.com/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.title);
		}

		if (Settings.user.searchBy === 1 && +Settings.user.batch > 1 && +capData.numHits < +Settings.user.batch) return;
		else if (Settings.user.gbatch && +Settings.user.batch > 1 && +capData.numHits < +Settings.user.batch) return;
		else if (Settings.user.onlyViable && !viable) return;
		state.scraperHistory.set(capData.groupId, capData);
	}, this);

	this.dispatch('control', { method: 'legacy', page: page, nextPageURL: nextPageURL });
}
