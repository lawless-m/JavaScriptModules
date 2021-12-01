const urlParams = new URLSearchParams(window.location.search);
/**
 * qs(key) - return the value of the querystring key
 * @param key 
 * @returns whatever the value is, if any
 */
export function qs(key) { return urlParams.get(key); }

