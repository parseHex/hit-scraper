export default function (e: Event) {
	const target = <HTMLInputElement>e.target;
	target.nextElementSibling.textContent = Math.floor(+target.value * 100) + '%';
}
