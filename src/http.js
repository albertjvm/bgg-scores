function fetch(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    xhr.send();

    xhr.onerror = function() {
      reject(xhr);
    };

    xhr.onload = function() {
      let response = xhr.response;

      resolve(response);
      // if ((/application\/json/).test(this.getResponseHeader('Content-Type')) && response.length) {
      //   response = JSON.parse(response);
      // } else {
      //   reject(response);
      // }
    };
  });
};

const http = {
  get: fetch.bind(null, "GET")
};

export default http;
