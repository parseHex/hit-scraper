export default `
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
