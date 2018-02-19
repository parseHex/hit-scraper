import table from './table';
import { label, sectionTitle, input } from '../_dom'

export default function () {
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
				</section>
			</div>
			${table}
		</div>
	`;
}
