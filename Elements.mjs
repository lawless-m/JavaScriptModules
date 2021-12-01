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
        default :
            e.setAttribute(a, attribs[a])
        }
    }
    if(append) {
        if(Array.isArray(append)) {
            let ar = append.flat()
            for(let a=0; a<ar.length; a++) {
                e.append(ar[a])
            }
        } else {
            e.append(append)
        }
        
    }
    return e
}

/**
 * byId(id, src) - return the elementById from src or document by default
 * @param id 
 * @param src 
 * @returns 
 */
export function byId(id, src) {
    if(!src) {
        src = document
    }
    return src.getElementById(id)
}

/**
 * byData(data, src, value) - return the HTMLNodes conforming to data-$data as an array from src
 * @param data - the data key to use
 * @param src - the elements to start with, defaults to document
 * @param value - if given, also use =$value as a key
 * @returns 
 */
export function byData(data, src, value) {
    if(!src) {
        src = document
    }
    if(value === undefined) {
        return Array.from(src.querySelectorAll(`[data-${data}]`));
    } else {
        return Array.from(src.querySelectorAll(`[data-${data}="${value}"]`));
    }
}

/**
 * data(el, data) - return the value of the data element from the node
 * @param el - the node element
 * @param data - the data key
 * @returns - the value
 */
export function data(el, data) {
    return el.attributes[`data-${data}`].value
}

/**
 * nbsp - the string to use a non-breaking space
 */
export const nbsp = String.fromCharCode(160);
