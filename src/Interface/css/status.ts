export default `
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
	#status-retrieving-to.hidden {
		/* prevent screen jump from asyncTO */
		display: block !important;
		visibility: hidden;
	}
	button#retryTO.disabled {
		background-color: lightgray;
    color: darkgray;
	}
	button#retryTO:focus {
		outline: 0;
	}
`;
