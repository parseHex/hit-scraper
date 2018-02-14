import { cleanTemplate } from '../../lib/util';
import Settings from '../../Settings/index';
import {
	audio0, audio1,
} from '../../lib/constants';
import enums from '../../lib/enums';

import titles from '../titles';
import table from './table';
import status from './status';

export default function () {
	const { user } = Settings;

	const _cb = user.showCheckboxes ? '' : 'hidden';
	const _u0 = new Uint8Array(Array.prototype.map.call(window.atob(audio0), v => v.charCodeAt(0)));
	const _u1 = new Uint8Array(Array.prototype.map.call(window.atob(audio1), v => v.charCodeAt(0)));
	const ding = URL.createObjectURL(new Blob([_u0], { type: 'audio/ogg' }));
	const squee = URL.createObjectURL(new Blob([_u1], { type: 'audio/mp3' }));

	const ph = Settings.user.hidePanel ? 'hiddenpanel' : '';
	const phB = Settings.user.hidePanel ? 'Show Panel' : 'Hide Panel';

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
		${status}
		${table.apply(this)}
	`);
	// NOTE: the above commented-out column is the HITDB column
}
