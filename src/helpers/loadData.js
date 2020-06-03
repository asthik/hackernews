import 'isomorphic-fetch';

export default story => {
    let url = `https://hn.algolia.com/api/v1/search?tags=${story}`;
    return fetch(url)
            .then(response => response.json())
            .then(data => { return data });
}