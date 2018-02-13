export default `
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
	.ignored td {
		border:2px solid #00E5FF;
	}
	.includelisted td {
		border:2px dashed #008800;
	}
	.blocklisted td {
		border:2px solid #cc0000;
	}
`;
