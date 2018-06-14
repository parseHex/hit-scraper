export default `
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
`;
