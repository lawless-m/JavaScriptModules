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
            e.checked = attribs[a]
            break;
        case "onclick":
            e.onclick = attribs[a];
            break;
        case "oninput":
            e.oninput = attribs[a];
            break;
        case "onblur":
            e.onblur = attribs[a];
            break;
        default :
            e.setAttribute(a, attribs[a])
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

export function tr(attribs, append) { return create('tr', attribs, append); }
export function th(attribs, append) { return create('th', attribs, append); }
export function td(attribs, append) { return create('td', attribs, append); }


/**
 * byId(id, src) - return the elementById from src or document by default
 * @param id 
 * @param src 
 * @returns 
 */
export function byId(id, src) {
    return (src ? src : document).getElementById(id)
}

/**
 * byData(data, src, value) - return the HTMLNodes conforming to data-$data as an array from src
 * @param data - the data key to use
 * @param src - the elements to start with, defaults to document
 * @param value - if given, also use =$value as a key
 * @returns 
 */
export function byData(data, src, value) { // might work ? :)
    return (value === undefined) ? 
        Array.from((src ? src : document).querySelectorAll(`[data-${data}]`))
        :
        Array.from((src ? src : document).querySelectorAll(`[data-${data}='${value}']`));
}

/**
 * data(el, data) - return the value of the data element from the node
 * @param el - the node element
 * @param data - the data key
 * @returns - the value
 */
export function getData(data, el) {
    return el.attributes[`data-${data}`].value
}

export function getFirstData(col_key, src, col_value, data) {
    let els = byData(col_key, src, col_value);
    if(els) {
        return getData(data, els[0]);
    }
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
export function removeChildren(e) { 
	while(e.firstChild) e.removeChild(e.firstChild); 
}

export function select_node(node) {
    let rng = new Range();
    rng.setStartBefore(node.firstChild);
    rng.setEndAfter(node.firstChild);
    document.getSelection().addRange(rng);
}
