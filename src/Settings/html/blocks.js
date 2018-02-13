import { cleanTemplate } from '../../lib/util';

export default function () {
	return cleanTemplate(`
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative; left:-8px">
					<b>Advanced Matching</b>
				</span>
				<p>
					<label for="wildblocks" style="float:left; width:95px">
						Allow Wildcards
					</label>
					<input &nbsp;
						id="wildblocks"
						type="checkbox"
						${this.user.wildblocks ? 'checked' : ''}
					/>
				</p>
			</div>
			<section style="margin-left:150px">
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
			</section>
		</div>
	`);
}
