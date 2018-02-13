export default function (state) {
	document.body.querySelector('#curtain').style.display = state === 'on' ? 'block' : 'none';
	document.body.style.overflow = state === 'on' ? 'hidden' : 'auto';
}
