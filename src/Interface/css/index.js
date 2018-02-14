import editorsExporters from './editors-exporters';
import settings from './settings';
import resultsTable from './results-table';
import status from './status';

export default `
	* {
		box-sizing: border-box;
	}
	body {
		font-family: Verdana, Arial;
		font-size: 14px;
		margin: 0;
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
	button.disabled:not(#btnRetryTO) {
		position: relative;
	}
	button.disabled:not(#btnRetryTO):before {
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
	button.disabled:not(#btnRetryTO):after {
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
	button.disabled:not(#btnRetryTO):focus:before {
		display: block;
	}
	button.disabled:not(#btnRetryTO):focus:after {
		display: block;
	}

	${editorsExporters}
	${settings}
	${resultsTable}
	${status}
`;
