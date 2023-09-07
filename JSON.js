import { Post } from './Requests.js';

export function xhrJson(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

export async function fetchJson(url, callback) {
  fetch(url)
  .then((response) => {
    if(response.status == 200) {
      return response.json();
    } 
  })
  .then((data) => { if(callback) { callback(data); }; });
}

export async function postJson(url, data, callback) {
    Post(url, 'application/json', JSON.stringify(data), callback);
}

/** Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
export function downloadBlob(filename, content, contenttype) {
  // Create a blob
  var blob = new Blob([content], { type: contenttype });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

export function fetchJsonUrls(urls, callback) {
  /*
    urls is an array of objects { u1:url1, u2:url2, u3:url3 }

    returns an object containing data

    { u1:data1, u2:data2, u3:data3 }

  */
  Promise.all(Object.keys(urls).map(name => {
    return fetch(urls[name])
      .then(res => res.json())
      .then(data => ({ [name]: data }))
  })).then(results => { 
  
    callback(results.reduce((obj, item) => {
      Object.keys(item).forEach(key => {
        obj[key] = item[key]; 
      });
    
      return obj;
    }, {}));
  
  })
}
