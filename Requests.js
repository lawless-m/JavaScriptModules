export async function Post(url, datatype, data, callback) {
  fetch(url, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': datatype}
  })
  .then(response => response.json())
  .then(data => { if(callback) { callback(data); }});
}

export async function plainPost(url, data, callback) {
	Post(url, 'text/plain', data, callback);
}

export async function jsonPost(url, data, callback) {
    Post(url, 'application/json', JSON.stringify(data), callback);
}




