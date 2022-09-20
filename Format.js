export function isNumeric(v) {	return !isNaN(parseFloat(v)); }

export function int(txt) { if(txt == undefined) return 0; try { return parseInt(txt, 10); } catch(e) {}; return 0;}
export function float(txt) { if(txt == undefined) return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}
export function pc(f) { return `${f}%`; }
export function comma(num, digits) {
    if(digits != undefined) {
        num = dp(num, digits)
    }
     return num.toLocaleString('en-GB'); }
export function dp(num, digits) { 
    let scale = digits===undefined ? 1 : Math.pow(10, digits);
    return Math.round(scale*num)/scale;
}
export function div(n, d) { return d != 0 ? n / d : 0; }
