const API_PORT = 9000; // Only needed for local development. In AWS we'll host the API on 80/443

// Resolves to either "" or "localhost:9000"
const server = (endpoint) => {
  // Relative paths (i.e. not starting with http://...) resolve to the current IP:PORT
  let serverUrl = '';

  const { hostname } = window.location; // Read the current window URL hostname
  if (hostname == 'localhost' || hostname == '127.0.0.1') {
    // If it's locally hosted
    // Then we want to use an absolte path http://localhost:9000
    serverUrl = `http://localhost:${API_PORT}`;
  }

  return `${serverUrl}${endpoint}`; // Build the rest of the url
};

const get = async (url, responseFormat = 'json') => {
  let response = await fetch(url);
  let result = await response[responseFormat]();
  return result;
};

const headers = {
  // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
  Accept: 'text,application/json',
  // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
  'Content-Type': 'application/json',
};

const post = async (url, body, responseFormat = 'json') => {
  let response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  let result = await response[responseFormat]();
  return result;
};

const del = async (url, body, responseFormat = 'json') => {
  let response = await fetch(url, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
  });
  let result = await response[responseFormat]();
  return result;
};

const users = {
  getAll: () => get(server('/api/users')), // matchs the API routing in the server
  create: (user) => post(server('/api/users'), user),
  delete: (user) => del(server(`/api/users/${user.email}`)),
};

const alerts = {
  getSearchData: () => get(server('/api/alerts')),
  getDetails: (country_code) => get(server(`/api/alerts/${country_code}`)),
};

const util = {
  refreshDatabase: async (alert) => {
    try {
      let result = await post(server('/api/refresh'), {}); // No body needed for this request
      alert(result.message); // Show the result in the snackbar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e) {
      console.warn(`${e}`);
      alert('Failed to refresh database');
    }
  },
};

export {
  server,
  get,
  post,
  del,
  users,
  util,
  alerts, // new export
};
