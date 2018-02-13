import { cleanTemplate } from '../../lib/util'

export default function () {
	return cleanTemplate(`
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative;left:-8px">
					<b>Display Checkboxes</b>
				</span>
				<p>
					<label for="checkshow" style="float:left;width:51px">
						Show
					</label>
					<input &nbsp;
						id="checkshow"
						type="radio"
						name="checkbox"
						value="true"
						${this.user.showCheckboxes ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="checkhide" style="float:left;width:51px">
						Hide
					</label>
					<input &nbsp;
						id="checkhide"
						type="radio"
						name="checkbox"
						value="false"
						${this.user.showCheckboxes ? '' : 'checked'}
					/>
				</p>
			</div>
			<section style="margin-left:133px">
				<span style="position:relative;left:10px">
					<i>show</i>
				</span>
				<br />
				Shows all checkboxes and radio inputs on the control panel for sake of clarity.
			</section>
			<section style="margin-left:133px">
				<span style="position:relative;left:10px">
					<i>hide</i>
				</span>
				<br>
				Hides checkboxes and radio inputs for a cleaner, neater appearance. &nbsp;
				Their visibility is not required for proper operation; &nbsp;
				all options can still be toggled while hidden.
			</section>
		</div>
		<div>
			<div style="float:left;margin-left:15px">
				<span style="position:relative;left:-8px">
					<b>Themes</b>
				</span>
				<p>
					<select>
						<option value="classic"
							${this.user.themes.name === 'classic' ? 'selected' : ''}
						>
							Classic
						</option>
						<option value="deluge"
							${this.user.themes.name === 'deluge' ? 'selected' : ''}
						>
							Deluge
						</option>
						<option value="solDark"
							${this.user.themes.name === 'solDark' ? 'selected' : ''}
						>
							Solarium:Dark
						</option>
						<option value="solLight"
							${this.user.themes.name === 'solLight' ? 'selected' : ''}
						>
							Solarium:Light
						</option>
						<option value="whisper"
							${this.user.themes.name === 'whisper' ? 'selected' : ''}
						>
							Whisper
						</option>
					</select>
					<button id="thedit" style="cursor:pointer">
						Edit Current Theme
					</button>
				</p>
			</div>
		</div>
		<div>
			<div style="float:left;margin-left:15px">
				<span style="position:relative;left:-8px">
					<b>HIT Coloring</b>
				</span>
				<p>
					<label for="link" style="float:left;width:51px">
						Link
					</label>
					<input &nbsp;
						id="link"
						type="radio"
						name="hitColor"
						value="link"
						${this.user.hitColor === 'link' ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="cell" style="float:left;width:51px">
						Cell
					</label>
					<input &nbsp;
						id="cell"
						type="radio"
						name="hitColor"
						value="cell"
						${this.user.hitColor === 'cell' ? 'checked' : ''}
					/>
				</p>
			</div>
			<section style="margin-left:100px;padding-top:10px">
				<span style="position:relative;left:10px">
					<i>link</i>
				</span>
				<br>
				Apply coloring based on Turkopticon reviews to all applicable links in the results table.
			</section>
			<section style="margin-left:100px">
				<span style="position:relative;left:10px">
					<i>cell</i>
				</span>
				<br>
				Apply coloring based on Turkopticon reviews to the background of all &nbsp;
				applicable cells in the results table.
			</section>
			<p style="clear:both">
				<b>Note:</b> &nbsp;
				The Classic theme is exempt from these settings and will always colorize cells.
			</p>
		</div>
		<div>
			<div style="float:left;margin-left:15px">
				<span style="position:relative;left:-8px">
					<b>Font Size</b>
				</span>
				<p>
					<input &nbsp;
						name="fontSize"
						type="number"
						min="5"
						value="${this.user.fontSize}"
						style="width:45px"
					/>
				</p>
				<span style="position:relative;left:-8px">
					<b>New HIT Offset</b>
				</span>
				<p>
					<input &nbsp;
						name="shineOffset"
						type="number"
						value="${this.user.shineOffset}"
						style="width:45px"
					/>
				</p>
			</div>
			<section style="margin-left:100px;margin-top:15px">
				Change the font size (measured in px) for text in the results table. &nbsp;
				Default is 11px.
			</section>
			<section style="margin-left:100px;margin-top:40px;">
				Controls the font size of new HITs relative to the rest of the results. &nbsp;
				Default is 1px.
				<br />
				<i>Example:</i> &nbsp;
				With a font size of 11px and an offset of 1px, new HITs will be displayed at 12px.
		</section>
	</div>
	`);
}
