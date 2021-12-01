function isNumeric(v) {	return !isNaN(parseFloat(v)); }

export function isObject(objValue) { return objValue && typeof objValue === 'object' && objValue.constructor === Object; }

export function sortObjects(objs, by, asc) {
	let keys = Object.keys(objs);
	if (isNumeric(objs[keys[0]][by])) {
		var sortf = function(a, b) {
			a = parseInt(objs[a][by], 10);
			b = parseInt(objs[b][by], 10);
			return a < b ? -1 : a > b ? 1 : 0;
		}
	} else {
		var sortf = function(a, b) {
			a = objs[a][by];
			b = objs[b][by];
			return a < b ? -1 : a > b ? 1 : 0;
		}
	}
	let sorted = keys.sort(sortf);
	return asc ? sorted : sorted.reverse();
}

export function oneOfNested(obj) {
	let k = Object.keys(obj);
	while(isObject(obj[k[0]])) {
		obj = obj[k[0]];
   		k = Object.keys(obj);
	}
	return obj;
}

export function notKeys(obj, nots) {
	return Object.keys(obj).filter(o=>!nots.includes(o));
}

export function zeros(keys) {
	let obj = {};
	keys.flat().forEach(k=>{obj[k] = 0;})
	return obj;
}

export function select(objs, keys) {
	let selected = {};
	keys.forEach(k=>{
		selected[k] = objs[k];
	});
	return selected;
}
