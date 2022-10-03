
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
  .then((response) => response.json())
  .then((data) => { callback(data); });
}

export async function postJson(url, data, callback) {
  fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
  })
  .then((response) => response.json())
  .then((data) => { callback(data); });
}
