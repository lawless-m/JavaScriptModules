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

export function byId(id, src) {
    if(!src) {
        src = document
    }
    return src.getElementById(id)
}

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

export function data(el, data) {
    return el.attributes[`data-${data}`].value
}

export const nbsp = String.fromCharCode(160);
