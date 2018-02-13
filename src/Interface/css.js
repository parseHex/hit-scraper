export default `
	body {
		font-family: Verdana, Arial;
		font-size: 14px;
	}
	p {
		margin: 8px auto;
	}
	.cpdefault {
		display: inline-block;
		visibility: visible;
		overflow: hidden;
		padding: 8px 5px 1px 5px;
		transition: all 0.3s;
	}
	#controlpanel i:after, #status i:after {
		content: " | ";
	}
	input[type="checkbox"], input[type="radio"] {
		vertical-align: middle;
	}
	input[type="number"] {
		width: 50px;
		text-align: center;
	}
	label {
		padding: 2px;
	}
	.hiddenpanel {
		width: 0px;
		height: 0px;
		visibility: hidden;
	}
	.hidden {
		display: none;
	}
	button {
		border: 1px solid;
	}
	textarea {
		font-family: inherit;
		font-size: 11px;
		margin: auto;
		padding: 2px;
	}

	/* for editors/exporters */
	.pop {
		position: fixed;
		top: 15%;
		left: 50%;
		margin: auto;
		transform: translateX(-50%);
		padding: 5px;
		background: black;
		color: white;
		z-index: 20;
		font-size: 12px;
		box-shadow: 0px 0px 6px 1px #fff;
	}
	dt {
		text-transform: uppercase;
		clear: both;
		margin: 3px;
	}
	.icbutt {
		float: left;
		border: 1px solid #fff;
		cursor: pointer;
	}
	.icbutt > input {
		opacity: 0;
		display: block;
		width: 25px;
		height: 25px;
		border: none;
	}

	/* settings */
	#settingsMain {
		z-index: 20;
		position: fixed;
		background: #fff;
		color: #000;
		box-shadow: -3px 3px 2px 2px #7B8C89;
		line-height: initial;
		top: 50%;
		left: 50%;
		width: 85%;
		height: 85%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
	}
	#settingsMain > div {
		margin: 5px;
		padding: 3px;
		position: relative;
		border: 1px solid grey;
		line-height: initial;
	}
	.close {
		position: relative;
		font-weight: bold;
		font-size: 1em;
		color: white;
		background: black;
		cursor: pointer;
	}
	#settingsSidebar {
		width: 100px;
		min-width: 90px;
		height: 92%;
		float: left
	}
	#settingsSidebar > span {
		display: block;
		margin-bottom: 5px;
		width: 100px;
		font-size: 1em;
		cursor: pointer;
	}
	.settingsPanel {
		position: absolute;
		top: 0;
		left: 0;
		display: none;
		width: 100%;
		height: 100%;
		font-size: 11px;
	}
	.settingsPanel > div {
		margin: 15px 5px;
		position: relative;
		background: #CCFFFA;
		overflow: auto;
		padding: 6px 10px;
	}
	.settingsPanel section:not(:only-of-type) {
		padding: 4px 0;
	}
	.settingsPanel section:not(:only-of-type):not(:last-of-type) {
		border-bottom: 1px solid lightgray;
	}
	.settingsSelected {
		background: aquamarine;
	}
	.ble {
		border: 1px solid black;
		border-collapse: collapse;
	}
	.blec {
		padding: 5px;
		text-align: left;
	}

	#resultsTable button.block {
		padding: 1px 4px;
		margin-right: 1px;
	}
	.toLink, .hit-title {
		position: relative;
	}
	.toLink:before, .hit-title:before {
		content: "";
		display: none;
		z-index: 5;
		position: absolute;
		top: 0;
		left: -6px;
		width: 0;
		height: 0;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		border-left: 6px solid black;
	}
	.toLink:hover:before, .hit-title:hover:before {
		display: block;
	}
	.tooltip {
		z-index: 5;
		position: absolute;
		top: 0;
		right: calc(100% + 6px);
		text-align: left;
		transform: translateY(-20%);
		padding: 5px;
		font-weight: normal;
		font-size: 11px;
		line-height: 1;
		display: none;
		background: black;
		color: white;
		box-shadow: 0px 0px 6px 1px #fff;
	}
	meter {
		width: 100%;
		position: relative;
		height: 15px;
	}
	meter:before, .ffmb {
		display: block;
		font-size: 10px;
		font-weight: bold;
		color: black;
		content: attr(data-attr);
		position: absolute;
		top: 1px;
	}
	meter:after, .ffma {
		display: block;
		font-size: 10px;
		font-weight: bold;
		color: black;
		content: attr(value);
		position: absolute;
		top: 1px;
		right: 0;
	}
	#resultsTable button {
		border-radius: 3px;
		height: 14px;
		font-size: 8px;
		border: 1px solid;
		padding: 0;
		background: transparent;
	}
	#resultsTable .ex {
		padding: 0 9px;
	}
	#resultsTable .pc-p, #resultsTable .pc-o {
		background-color: rgba(0, 50, 150, 0.75);
		color: white;
	}
	#resultsTable tbody td > div {
		display: table-cell;
	}
	#resultsTable tbody td > div:first-child {
		padding-right: 2px;
		vertical-align: middle;
		white-space: nowrap;
	}
	button.disabled {
		position: relative;
	}
	button.disabled:before {
		content: "";
		display: none;
		z-index: 5;
		position: absolute;
		top: -7px;
		left: 50%;
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid black;
		transform: translateX(-50%);
	}
	button.disabled:after {
		content: "Exports are disabled while logged out.";
		display: none;
		z-index: 5;
		position: absolute;
		top: -7px;
		left: 50%;
		color: white;
		background: black;
		width: 230px;
		padding: 2px;
		transform: translate(-50%,-100%);
		box-shadow: 0px 0px 6px 1px #fff;
		font-size: 12px;
	}
	button.disabled:focus:before {
		display: block;
	}
	button.disabled:focus:after {
		display: block;
	}
	.spinner {
		display: inline-block;
		animation: kfspin 0.7s infinite linear;
		font-weight: bold;
	}
	@keyframes kfspin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(359deg);
		}
	}
	.spinner:before {
		content: "*";
	}
	.ignored td {
		border:2px solid #00E5FF;
	}
	.includelisted td {
		border:2px dashed #008800;
	}
	.blocklisted td {
		border:2px solid #cc0000;
	}

	#status-retrieving-to.hidden {
		/* prevent screen jump from asyncTO */
		display: block !important;
		visibility: hidden;
	}

	.row:after {
    content: "";
    display: table;
    clear: both;
	}
	.column {
		float: left;
	}
	.column.opts {
		width: 35%;
	}
	.column.opts-dsc {
		width: 65%;
	}
	.dsc-title {
		font-style: italic;
		font-weight: bold;
		display: block;
	}
`;
