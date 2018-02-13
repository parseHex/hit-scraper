import Interface from '../Interface/index';
import HITStorage from '../HITStorage/index';

export default class DBQuery {
	constructor(node) {
		Interface.toggleOverflow('on');
		this.node = document.body.appendChild(document.createElement('DIV'));
		this.node.style.cssText = 'position:fixed;z-index:20;top:50%;left:50%;padding:8px;' +
			'background:#fff;color:#000;box-shadow:0px 0px 6px 1px #bfbfbf;transform:translate(-50%,-50%);';
		this.node.innerHTML = '<div style="text-align:center;font-size:16px;"><p><b>Querying database... <i class="spinner"></i></b></p></div>';
		HITStorage.query(node).then(r => {
			var _tbody = [], _tfoot, t = { hits: 0, app: 0, rej: 0, pen: 0 },
				_thead = '<tr style="background:lightgrey;color:black"><th style="width:90px;padding:5px">Date</th>' +
					'<th style="width:120px">Requester</th><th>Title</th><th>Pay</th><th>Bonus</th><th>Status</th><th>Feedback</th></tr>',
				html = '<div style="position:absolute;top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">' +
					'<label id="close" class="close" title="Close">&#160;&#10008;&#160;</label></div>';
			if (!r.length)
				html += `<h2>Nothing found matching "${node.dataset.value}"</h2>`;
			else {
				r.forEach((v, i) => {
					var _pay, _bonus, _sc, _bg;
					if (typeof v.reward === 'object') {
						_pay = '$' + v.reward.pay.toFixed(2);
						_bonus = v.reward.bonus > 0 ? '$' + v.reward.bonus.toFixed(2) : '';
					} else {
						_pay = '$' + v.reward.toFixed(2);
						_bonus = '';
					}

					_sc = /(paid|approved)/i.test(v.status) ? 'green' : (/approval/i.test(v.status) ? 'orange' : 'red');
					_bg = v[node.dataset.cmpIndex] === node.dataset.cmpValue ? 'lightgreen' : (i % 2 ? '#F1F3EB' : '#fff');
					_tbody.push(`<tr style="background:${_bg}">
            <td>${v.date}</td><td>${v.requesterName}</td><td>${v.title}</td><td>${_pay}</td><td>${_bonus}</td>
            <td style="color:${_sc}">${v.status}</td><td>${v.feedback}</td></tr>`);
					t.hits++;
					t.app += /(paid|approved)/i.test(v.status) ? +_pay.slice(1) : 0;
					t.rej += /rejected/i.test(v.status) ? +_pay.slice(1) : 0;
					t.pen += /approval/i.test(v.status) ? +_pay.slice(1) : 0;
				});
				_tfoot = `<tr style="background:lightgrey;text-align:center"><td colspan="7">${t.hits} HITs: $${t.app.toFixed(2)} approved,
          $${t.pen.toFixed(2)} pending, $${t.rej.toFixed(2)} rejected</td>`;
				html += `<div style="margin-top:20px;width:100%;height:calc(100% - 20px);overflow:auto">
          <table style="border:1px solid black;border-collapse:collapse;width:100%">
          <thead>${_thead}</thead><tbody>${_tbody.join('')}</tbody><tfoot>${_tfoot}</tfoot></table></div>`;
			}
			this.node.style.cssText += `width:85%;${r.length ? 'height:85%;' : 'max-height:85%;'}`;
			this.node.innerHTML = html;
			this.node.querySelector('#close').onclick = this.die;
		}, () => this.die());
	}
	die() {
		this.node.remove();
		Interface.toggleOverflow('off');
	}
}
