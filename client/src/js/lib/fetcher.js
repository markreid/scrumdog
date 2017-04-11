/**
 * fetcher
 * make fetch a bit more useful.
 *
 */

const headers = new Headers();
headers.set('Content-Type', 'application/json');
const credentials = 'same-origin';


const fetcher = (path, opts) => fetch(path, {
  headers,
  credentials,
  ...opts,
})
.then((response) => {
  if (!response.ok) {
    return response.json()
    .then((json) => {
      throw json;
    });
  }

  return response.json();
});

fetcher.log = (path, opts) => fetcher(path, opts)
.then((json) => {
  console.log(json);
  return json;
});

// put it on the window because it's useful
// to be able to use it in the browser...

window.fetcher = fetcher;

export default fetcher;
