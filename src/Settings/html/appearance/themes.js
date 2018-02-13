import { sectionTitle, select } from '../_dom';

export default function () {
	const { user } = this;

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
				${select(options, user.themes.name)}
				<button id="thedit" style="cursor:pointer">
					Edit Current Theme
				</button>
			</p>
		</div>
	`;
}
