export default function (hex: string) {
	// TODO: put in Colors object
	var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
	return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}
