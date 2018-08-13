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
	#controlbuttons {
		margin-top: 3px;
		cursor: default;
	}
	#controlbuttons button {
		outline: none;
	}
	button#settings {
		margin-right: 5px;
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

	${editorsExporters}
	${settings}
	${resultsTable}
	${status}
`;
