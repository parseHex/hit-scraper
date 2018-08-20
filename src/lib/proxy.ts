/*
	This function is very simple:
	Take an object (or array), and return a Proxy of that object;
	all the proxy does is call `callback` whenever any property gets changed (recursively).
	I don't know how to explain this to TypeScript so I'm just going to throw @ts-ignore around.
	Please forgive me.
*/

export default function makeProxy<T extends object>(target: T, callback: () => void): T {
	const obj = Array.isArray(target) ? <T>[] : <T>{};

	const keys = Object.keys(target);
	for (let i = 0; i < keys.length; i++) {
		// @ts-ignore
		const val = target[keys[i]];
		if (typeof val !== 'object' || val === null) {
			// @ts-ignore
			obj[keys[i]] = val;
		} else {
			// @ts-ignore
			obj[keys[i]] = makeProxy(val, callback);
		}
	}

	return new Proxy(obj, {
		set: function (...args) {
			callback();
			return Reflect.set(...args);
		},
	});
}
