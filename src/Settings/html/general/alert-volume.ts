import { sectionTitle, input, label } from '../_dom';

export default function () {
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
