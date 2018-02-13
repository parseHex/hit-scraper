import { cleanTemplate } from '../../lib/util';

export default function () {
	const _hwtf = 'https://www.reddit.com/r/HITsWorthTurkingFor';
	const _ccs = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints';

	return cleanTemplate(`
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative; left:-8px">
					<b>Export Buttons</b>
				</span>
				<p>
					<label for="exportVb" style="float:left; width:51px">
						vBulletin
					</label>
					<input &nbsp;
						id="exportVb"
						name="export"
						value="vb"
						type="checkbox"
						${this.user.exportVb ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="exportIrc" style="float:left; width:51px">
						IRC
					</label>
					<input &nbsp;
						id="exportIrc"
						name="export"
						value="irc"
						type="checkbox"
						${this.user.exportIrc ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="exportHwtf" style="float:left; width:51px">
						Reddit
					</label>
					<input &nbsp;
						id="exportHwtf"
						name="export"
						value="hwtf"
						type="checkbox"
						${this.user.exportHwtf ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="exportPcp" style="float:left; width:51px">
						Panda Crazy - Panda
					</label>
					<input &nbsp;
						id="exportPcp"
						name="export"
						value="pc-p"
						type="checkbox"
						${this.user.exportPcp ? 'checked' : ''}
					/>
				</p>
				<p>
					<label for="exportPco" style="float:left; width:51px">
						Panda Crazy - Once
					</label>
					<input &nbsp;
						id="exportPco"
						name="export"
						value="pc-o"
						type="checkbox"
						${this.user.exportPco ? 'checked' : ''}
					/>
				</p>
			</div>
			<section style="margin-left:110px">
				<span style="position:relative; left:10px">
					<i>vBulletin</i>
				</span>
				<br />
				Show a button in the results to export the specified HIT with vBulletin &nbsp;
				formatted text to share on forums.
			</section>
			<section style="margin-left:110px">
				<span style="position:relative; left:10px">
					<i>IRC</i>
				</span>
				<br />
				Show a button in the results to export the specified HIT streamlined for sharing on IRC.
			</section>
			<section style="margin-left:110px">
				<span style="position:relative; left:10px">
					<i>Reddit</i>
				</span>
				<br />
				Show a button in the results to export the specified HIT for sharing on Reddit, formatted to &nbsp;
				<a style="color:black" href="${_hwtf}" target="_blank">r/HITsWorthTurkingFor</a> standards.
			</section>
			<section style="margin-left:110px">
				<span style="position:relative; left:10px">
					<i>Panda Crazy - Panda</i>
				</span>
				<br />
				Show a button in the results to export the specified HIT to Panda Crazy's Panda queue.
			</section>
			<section style="margin-left:110px">
				<span style="position:relative; left:10px">
					<i>Panda Crazy - Once</i>
				</span>
				<br />
				Show a button in the results to export the specified HIT to Panda Crazy's Once queue.
			</section>
		</div>
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative; left:-8px">
					<b>Bubble New HITs</b>
				</span>
				<p>
					<label for="bubbleNew" style="float:left; width:51px">
						Enable
					</label>
					<input &nbsp;
						id="bubbleNew"
						type="checkbox"
						${this.user.bubbleNew ? 'checked' : ''}
					/>
				</p>
			</div>
			<section style="margin-left:100px; margin-top:23px">
				When this option is enabled, new HITs will always be placed at the top of the results table.
			</section>
		</div>
		<div>
			<div style="float:left; margin-left:15px">
				<span style="position:relative; left:-8px">
					<b>Alert Volume</b>
				</span>
				<p>
					<label style="float:left;width:45px">
						Ding
					</label>
					<input &nbsp;
						name="ding"
						type="range"
						value=${this.user.volume.ding}
						max="1"
						step="0.02"
						min="0"
					/>
					<span style="padding-left:10px">
						${Math.floor(this.user.volume.ding * 100)}%
					</span>
				</p>
				<p>
					<label style="float:left;width:45px">
						Squee
					</label>
					<input &nbsp;
						name="squee"
						type="range"
						value=${this.user.volume.squee}
						max="1"
						step="0.02"
						min="0"
					/>
					<span style="padding-left:10px">
						${Math.floor(this.user.volume.squee * 100)}%
					</span>
				</p>
			</div>
		</div>
	`);
}
