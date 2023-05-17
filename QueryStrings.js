const urlParams = new URLSearchParams(window.location.search);
/**
 * qs(key) - return the value of the querystring key
 * @param key 
 * @returns whatever the value is, if any
 */
export function qs(key) { 
    let v = urlParams.get(key);
    if(v == null) {
        return ''
    }     
    return v; 
}

export function buildQS(base, params) {
    let gets = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    return `${base}?${gets}`;
}

