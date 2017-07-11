export default class StringHelper extends String {
	constructor() {
		super()
	}

	static parseToArray(bit, s) {
		const { split } = this.prototype;
		let ret = split(s || '|');
		return bit ? ((l,n) => {
			for(; l--;) ret[l] = parseInt(ret[l], bit);
			return ret;
		})(ret.length) : ret;
	}

	static trim() {
		let str = this;
		str = str.replace(/^\s\s*/, '');
		ws = /\s/, i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1)
	}

	static replaceTpl(o) {
		return this.replace(/#\{([^}]*)\}/mg, (v,k) => () => v = o[k.trim()])
	}
}