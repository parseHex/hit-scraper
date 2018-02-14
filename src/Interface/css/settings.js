export default `
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
		width: 100%;
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
	.sec-title {
		font-size: 1.2em;
		border-bottom: 2px solid;
		padding-bottom: 1px;
	}
	.column.opts > p:not(.no-align) {
		position: relative;
	}
	.column.opts > p:not(.no-align) > input[type="checkbox"],
	.column.opts > p:not(.no-align) > input[type="radio"] {
		position: absolute;
		right: 20px;
	}
	.column.opts > p:not(.no-align) > input[type="number"] {
		position: absolute;
		right: 10px;
	}
`;
