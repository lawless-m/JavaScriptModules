

/**
 * isObject(0) - is the supplied value an object
 * @param o
 * @returns boolean
 */
export function isObject(o) { return o && typeof o === 'object' && o.constructor === Object; }

/**
 * sortObjects(objs, by, asc) - sort the objects using the objs[by] in order asc[ending]
 * @param objs 
 * @param by 
 * @param asc 
 * @returns an array of the keys, in the appropriate order
 */

export function sortObjects(objs, by, asc) {
	function lt(a,b) {
		a = objs[a][by];
		b = objs[b][by];
		return a < b ? -1 : a > b ? 1 : 0;
	}	
	return Object.keys(objs).sort(asc ? (a,b)=>lt(a,b) : (a,b)=>lt(b,a))
}
/**
 * oneOfNested(obj) - in a nested set of objects "a" : { "b" : { "c" : { id:"a", type:"b", code:"c"}}}, return the first found inner value
 * @param obj 
 * @returns 
 */
export function oneOfNested(obj) {
	let k = Object.keys(obj);
	while(isObject(obj[k[0]])) {
		obj = obj[k[0]];
   		k = Object.keys(obj);
	}
	return obj;
}
/**
 * notKeys(onj, nots) - return a list of keys not including nots
 * @param obj 
 * @param nots 
 * @returns 
 */
export function notKeys(obj, nots) {
	return Object.keys(obj).filter(o=>!nots.includes(o));
}
/**
 * zeros(keys) - given a set of keys, return an object with those keys with value 0
 * @param keys 
 * @returns 
 */
export function zeros(keys) {
	let obj = {};
	keys.flat().forEach(k=>{obj[k] = 0;})
	return obj;
}
/**
 * select(objs, keys) - select just the given keys from the object 
 * @param objs 
 * @param keys 
 * @returns the selected items
 */
export function select(objs, keys) {
	let selected = {};
	keys.forEach(k=>{
		selected[k] = objs[k];
	});
	return selected;
}

/**
 * combine(sub, dom) combined the objects, repeated key values are taken from dom
 * @param sub - an Object
 * @param dom - an Object
 * @returns  the combined items
 */
export function combine(sub, dom) {
	let combined = {};
	if(isObject(sub)) {
		Object.keys(sub).forEach(k=>{
			combined[k] = sub[k];
		});
	}
	if(isObject(dom)) {
		Object.keys(dom).forEach(k=>{
			combined[k] = dom[k];
		});
	}
	return combined;
}
