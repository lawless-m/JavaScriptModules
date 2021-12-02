
export function int(txt) { try { return parseInt(txt, 10); } catch(e) {}; return 0;}
export function float(txt) { try { return parseFloat(txt, 10); } catch(e) {}; return 0;}
export function pc(f) { return `${f}%`; }
export function comma(num) { return num.toLocaleString('en-GB'); }
export function dp(num, digits) { 
    let scale = digits===undefined ? 1 : 10 ^ digits;
    return Math.round(scale*num)/scale;
}
export function div(n, d) { return d > 0 ? Math.round(n / d) : 0; }
