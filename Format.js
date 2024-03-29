
export function isNumeric(v) {	return !isNaN(parseFloat(v)); }
export function int(txt) { if(txt == undefined) return 0; try { return parseInt(txt, 10); } catch(e) {}; return 0;}
export function float(txt) { if(txt == undefined || txt == '') return 0.0; try { return parseFloat(txt.replace(/,/g, ''), 10); } catch(e) {}; return 0;}
export function pc(f) { return `${f}%`; }

export function float_eq(a, b, threshold = 0.01) {
    return Math.abs(a - b) < threshold;
}

export function pcdp(f, digits) {
    let p = dp(100 * f, digits);
    return [f, `${p.toFixed(digits)}%`];
}

export function pc2(n, d) {
    if(!n || !d || (n == 0 && d == 0)) { return [0,'0.0%']; }
    return pcdp(fdiv(n,d), 1);
}

export function fixed(t, digits) {
    let dot = t.indexOf('.');
    if(dot < 0) {
        return `${t}.${'0'.repeat(digits)}`;
    }
    return t.substring(0, dot) + '.' + (t.substring(dot+1) + '0'.repeat(digits)).substring(0,digits);
}

export function fixed2(t) { return fixed(t, 2); }

export function fixed2comma(num) { return fixed(comma(num,2), 2); }

export function comma(num, digits) {
    if(digits != undefined) { num = dp(num, digits); }
    return num.toLocaleString('en-GB'); 
}

export function dp(num, digits) { 
    return parseFloat(parseFloat(num).toFixed(digits));
}

export function fdiv(n, d) { 
    if(isNaN(n) || isNaN(d) || d == 0) {
        return 0;
    }
    return n / d;
}

export function mul(a, b) {
    if(isNaN(a) || isNaN(b) || a == undefined || b == undefined) {
        return 0;
    }
    return a * b;

}

export function neg_red(e, v) { 
    if(e.disabled) {
        e.style.color = (v < 0) ? '#600' : '#666'; 
    } else {
        e.style.color = (v < 0) ? 'red' : 'black'; 
    }
    
}

