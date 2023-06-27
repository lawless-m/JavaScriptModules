const urlParams = new URLSearchParams(window.location.search);
/**
 * qs(key) - return the value of the querystring key
 * @param key 
 * @returns whatever the value is, if any
 */
export function qs(key, def='') { 
    let v = urlParams.get(key);
    if(v == null) {
        return def;
    }     
    return v; 
}

export function buildQS(baseURL, parameters) {
  const queryParams = [];
  for (const key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`);
    }
  }
  return `${baseURL}?${queryParams.join('&')}`;
}

