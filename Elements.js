export function isString(t) {
    return typeof t === 'string' || t instanceof String;
}

function esc(t) {
    return isString(t) ? t.replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;') : t;
}

/**  
 * create(tag, attribs, append) - create an HTMLNode with attribs and anything in the flattened list append appended
 * @param tag - html tag
 * @param attribs  - {id:"a", style:"color:red", onclick:()=>alert("hi")}
 * @param append  - a list of HTMLNodes (or text) to append, in order
 * @returns the HTMLNode
 */

export function create(tag, attribs, append) {
    let e = document.createElement(tag);
    for(let a in attribs) {
        switch(a) {
        case "checked":
            e.checked = attribs[a];
            break;
        case "disabled":
            e.disabled = attribs[a];
            break;
        case "onclick":
            e.onclick = attribs[a];
            break;
        case "ondblclick":
            e.ondblclick = attribs[a];
            break;
        case "oninput":
            e.oninput = attribs[a];
            break;
        case "onblur":
            e.onblur = attribs[a];
            break;
        case "onkeyup":
            e.onkeyup = attribs[a];
            break;
        case "onkeydown":
            e.onkeydown = attribs[a];
            break;
        case "onpaste":
            e.onpaste = attribs[a];
            break;
        case "open":
            e.open = attribs[a] == "open";
            break;
        default :
            e.setAttribute(a, esc(attribs[a]));
        }
    }
    if(append) {
        if(Array.isArray(append)) {
            append.flat().forEach(a=>{e.append(a);})
        } else {
            e.append(append)
        }
    }
    return e
}

export function table(attribs, append) { return create('table', attribs, append); }
export function thead(attribs, append) { return create('thead', attribs, append); }
export function tbody(attribs, append) { return create('tbody', attribs, append); }
export function tr(attribs, append) { return create('tr', attribs, append); }
export function th(attribs, append) { return create('th', attribs, append); }
export function td(attribs, append) { return create('td', attribs, append); }
export function link(attribs, append, onclick) {
    if(onclick) {
        attribs.onclick = onclick;
        attribs.href = '#';
    }
    return create('a', attribs, append); 
}

export function h2(attribs, append) { return create('h2', attribs, append); }
export function p(attribs, append) { return create('p', attribs, append); }
export function div(attribs, append) { return create('div', attribs, append); }
export function bold(txt) { return create('b', {}, txt); }
export function italic(txt) { return create('i', {}, txt); }
export function main(attribs, append) { return create('main', attribs, append); }
export function inputfloat(attribs) { 
    attribs.type = 'text';
    attribs.inputmode = 'numeric';
    attribs.onclick = e => { e.target.select() };
    attribs.align='right;'
    return create('input', attribs); 
}
export function input(attribs) { 
    attribs.type = 'text';
    attribs.onclick = e => { e.target.select() };
    attribs.align = 'left;'
    return create('input', attribs); 
}
export function dialog(attribs, append) { return create('dialog', attribs, append); }
export function form(attribs, append) { return create('form', attribs, append); }
export function label(text, attribs, append) { 
    if(append == undefined) {
        append = text;
    } else {
        if(Array.isArray(append)) {
            append.unshift(text);
        } else {
            append = [text, append];
        }
    }
    return create('label', attribs, append); 
}
export function button(attribs, append) { return create('button', attribs, append); }
export function text(txt) { return document.createTextNode(txt); }
export function br() { return create('br'); }
export function fieldset(attribs, append) { return create('fieldset', attribs, append); }
export function legend(attribs, append) { return create('legend', attribs, append); }

export function chk(attribs, txt) {
    attribs.type = 'checkbox';
    return create('input', attribs, txt);
}

export function sup(txt) { return create('sup', {}, txt); }
export function sub(txt) { return create('sub', {}, txt); }

export function brs(txts) {
    let els = [txts[0]];

    txts.slice(1).forEach(t => {
        els.push(br());
        els.push(t);
    });
    return els;
}

export function script(src, callback) { 
    let e = create('script', {'src':src, 'async':true});
    if(callback) {
        e.addEventListener('load', callback, false);
    }
    return e;
}
export function module(src) { let e = script(src); e.type = 'module'; return e; }

export function css(src, callback) {
    let e = create("link", {'rel':'stylesheet', 'type':'text/css', 'href':src});
    if(callback) {
        e.addEventListener('load', callback, false);
    }
    return e;
}

export function ul(attribs, append) { return create('ul', attribs, append); }
export function li(attribs, append) { return create('li', attribs, append); }
export function img(src, alt, width, height) { 
    let a = {'src':src};
    if(alt == undefined) {
        alt = 'image';
    }
    a.alt = alt;
    a.title = alt;
    if(width != undefined) {
        a.width = width;
    }
    if(height != undefined) {
        a.height = height;
    }
    return create('img', a);
}

export function colgroup(append) {
    return create('colgroup', {}, append);
}

export function col(attribs) {
    return create('col', attribs);
}

export function colwidths(ws, attribs) {
    let cols = Array(ws.length).fill({});
    for(let w = 0; w < ws.length; w++) {
        cols[w] = col();
        cols[w].style.width = ws[w];
    }
    return create('colgroup', attribs, cols);
}

/**
 * byId(id, src) - return the elementById from src or document by default
 * @param id 
 * @param src 
 * @returns 
 */
export function byId(id, src) {
    return (src ? src : document).querySelector(`#${id}`);
}

export function byClass(clas, src) {
    return (src ? src : document).getElementsByClassName(clas);
}
/**
 * byData(key, src, value) - return the HTMLNodes conforming to data-$data as an array from src
 * @param key - the key to use
 * @param src - the elements to start with, defaults to document
 * @param value - if given, also use =$value as a key
 * @returns 
 */
export function byData(key, src, value) { // might work ? :)
    return (value === undefined) ? 
        Array.from((src ? src : document).querySelectorAll(`[${key}]`))
        :
        Array.from((src ? src : document).querySelectorAll(`[${key}='${clean_data_value(value)}']`));
}

export function byDataFirst(data, src, value) {
    let els = byData(data, src, value);
    if(els.length > 0) {
        return els[0];
    }
}

/**
 * data(el, data) - return the value of the data element from the node
 * @param el - the node element
 * @param data - the data key
 * @returns - the value
 */
export function getData(data, el) {
    if(el) { return el.getAttribute(`data-${data}`); }
}

function float(txt) { if(txt == undefined) return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}

export function getFloat(data, el) { return float(getData(data, el)); }

export function getDataFirst(col_key, src, col_value, data) {
    let els = byData(col_key, src, col_value);
    if(els) {
        return getData(data, els[0]);
    }
}

export function applyByData(fn, data, nodes, value) {
    byData(data, nodes, value).map(fn);
}

/**
 * nbsp - the string to use a non-breaking space
 */
export const nbsp = String.fromCharCode(160);

/**
 * removeChildren(e) - remove all the child nodes from an element
 * @param e - parent element
 * @returns undefined
 */
export function removeChildren(e) { if(e) { while(e.firstChild) e.removeChild(e.firstChild); } }

export function select_node(node) {
    if(node) {
        let rng = new Range();
        if (node.childNodes.length > 0) {
            rng.setStartBefore(node.firstChild);
            rng.setEndAfter(node.firstChild);
            document.getSelection().addRange(rng);
        }
    }
    return node;
}

export function setData(data, node, v, apply) {
    if(node && node.setAttribute) {
        node.setAttribute(`data-${data}`, v);
        if(apply) {
            apply(node, v);
        }
    }
    return node;
}

export function setDataText(data, node, valtext, apply) {
    if(setData(data, node, valtext[0], apply)) {
        node.textContent = valtext[1];
    }
    return node;
}

export function setDataTextFirst(data, nodes, valtext, apply) {
    return setDataText(data, byDataFirst(data, nodes), valtext, apply);
}

export function byDataPrev(data, node) {
    if(node) {
        for(node = node.previousSibling; node && node.getAttribute && node.getAttribute(`data-${data}`) == null; node = node.previousSibling);
    }
    return node;
}

export function byDataNext(data, node) {
    if(node) {
        for(node = node.nextSibling; node && node.getAttribute && node.getAttribute(`data-${data}`) == null; node = node.nextSibling);
    }
    return node;
}

export function get_position( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
          _x += el.offsetLeft - el.scrollLeft;
          _y += el.offsetTop - el.scrollTop;
          el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

HTMLElement.prototype.e_position = function() { 
    return get_position(this);
}


HTMLElement.prototype.e_removeChildren = function() { 
    removeChildren(this);
    return this;
}

HTMLElement.prototype.e_hide = function() { 
    this.style.display = 'none';
    return this;
}

HTMLElement.prototype.e_show = function() { 
    this.style.display = 'block';
    return this;
}

HTMLElement.prototype.e_set = function(source) { 
	if(typeof source === 'object' && source.constructor === Object) {
		Object.keys(source).forEach(k=>{
			this[k] = source[k];
		});
	}
    return this;
}

HTMLElement.prototype.e_insertBefore = function(e) { 
    this.parentNode.insertBefore(e, this.nextSibling);
}

HTMLElement.prototype.e_append = function(es) { 
    if(es == undefined) return;
    if(Array.isArray(es)) {
        es.flat().forEach(a=>{this.append(a);})
    } else {
        this.append(es)
    }
}

export function clean_data_value(v) {
    return v.replace('&', '');
}


