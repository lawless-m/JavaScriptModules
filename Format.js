export function isNumeric(v) {	return !isNaN(parseFloat(v)); }

export function int(txt) { if(txt == undefined) return 0; try { return parseInt(txt, 10); } catch(e) {}; return 0;}
export function float(txt) { if(txt == undefined) return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}
export function pc(f) { return `${f}%`; }

export function pc2(n, d) {
    if(n == undefined || d == undefined) {
        return [0,''];
    }
    if(n == 0 && d == 0) {
        return [0,''];
    }
    let p = dp(div(100*n,d),1);
    let t = `${p}%`;
    if(p == 100 || t.charAt(t.length-3) == '.') {
        return [p, t];
    }
    return [p, `${p}.0%`];
}

export function comma(num, digits) {
    if(digits != undefined) {
        num = dp(num, digits)
    }
     return num.toLocaleString('en-GB'); 
}

export function dp(num, digits) { 
    let scale = digits===undefined ? 1 : Math.pow(10, digits);
    return Math.round(scale*num)/scale;
}

export function div(n, d) { return d != 0 ? n / d : 0; }

export function neg_red(e, v) {
    if(v < 0) {
        e.style.color = 'red';
    } else {
        e.style.color = 'black';
    }
}

export function concat_class(obj, class_name) {
    obj.class = `${obj.class} ${class_name}`;
}
