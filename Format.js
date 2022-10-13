export function isNumeric(v) {	return !isNaN(parseFloat(v)); }

export function int(txt) { if(txt == undefined) return 0; try { return parseInt(txt, 10); } catch(e) {}; return 0;}
export function float(txt) { if(txt == undefined) return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}
export function pc(f) { return `${f}%`; }

export function pcdp(f, digits) {
    if(f == 1) {
        return [1,'100%'];
    }
    let p = dp(100 * f, digits);
    let t = `${p}`;
    if(digits == 0) {
        return [f, `${p}%`];
    }
    let zeros = '0'.repeat(digits);
    let dot = t.indexOf('.');
    if(dot < 0) {
        return [f, `${t}.${zeros}%`];
    }
    return [f, t.substring(0, dot) + '.' + (t.substring(dot+1) + zeros).substring(0,digits) + '%'];
}

export function pc2(n, d) {
    if(n == undefined || d == undefined) { return [0,'']; }
    if(n == 0 && d == 0) { return [0,'']; }
    return pcdp(div(n,d), 1);
}

export function comma(num, digits) {
    if(digits != undefined) { num = dp(num, digits); }
    return num.toLocaleString('en-GB'); 
}

export function dp(num, digits) { 
    let scale = digits===undefined ? 1 : Math.pow(10, digits);
    return Math.round(scale*num)/scale;
}

export function div(n, d) { return d != 0 ? n / d : 0; }

export function neg_red(e, v) { 
    if(e.disabled) {
        e.style.color = (v < 0) ? '#A00' : '#AAA'; 
    } else {
        e.style.color = (v < 0) ? 'red' : 'black'; 
    }
    
}

