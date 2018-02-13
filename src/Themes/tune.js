export default function (fg, bg) {
	var cbg = this.getBrightness(bg),
		lighten = c => {
			c.s = Math.max(0, c.s - 5);
			c.v = Math.min(100, c.v + 5);
			return c;
		},
		darken = c => {
			c.s = Math.min(100, c.s + 5);
			c.v = Math.max(0, c.v - 5);
			return c;
		},
		tune = (function () { if (cbg >= 128) return darken; else return lighten; })(),
		hex2hsv = function (c) {
			var r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16),
				min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, _hue;
			switch (max) {
				case r:
					_hue = Math.round(60 * (g - b) / delta);
					break;
				case g:
					_hue = Math.round(120 + 60 * (b - r) / delta);
					break;
				case b:
					_hue = Math.round(240 + 60 * (r - g) / delta);
					break;
			}
			return {
				h: _hue < 0 ? _hue + 360 : _hue,
				s: max === 0 ? 0 : Math.round(100 * delta / max),
				v: Math.round(max * 100 / 255)
			};
		},
		hsv2hex = function (c) {
			var r, g, b, pad = s => ('00' + s.toString(16)).slice(-2);
			if (c.s === 0) r = g = b = Math.round(c.v * 2.55).toString(16);
			else {
				c = { h: c.h / 60, s: c.s / 100, v: c.v / 100 }; // convert to prime to calc chroma
				var _t1 = Math.round((c.v * (1 - c.s)) * 255),
					_t2 = Math.round((c.v * (1 - c.s * (c.h - Math.floor(c.h)))) * 255),
					_t3 = Math.round((c.v * (1 - c.s * (1 - (c.h - Math.floor(c.h))))) * 255);
				switch (Math.floor(c.h)) {
					case 1:
						r = _t2;
						g = Math.round(c.v * 255);
						b = _t1;
						break;
					case 2:
						r = _t1;
						g = Math.round(c.v * 255);
						b = _t3;
						break;
					case 3:
						r = _t1;
						g = _t2;
						b = Math.round(c.v * 255);
						break;
					case 4:
						r = _t3;
						g = _t1;
						b = Math.round(c.v * 255);
						break;
					case 0:
						r = Math.round(c.v * 255);
						g = _t3;
						b = _t1;
						break;
					default:
						r = Math.round(c.v * 255);
						g = _t1;
						b = _t2;
						break;
				}
			}
			return '#' + pad(r) + pad(g) + pad(b);
		};

	while (Math.abs(this.getBrightness(fg) - cbg) < 90) fg = hsv2hex(tune(hex2hsv(fg)));
	return fg;
};
