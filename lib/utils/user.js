const fetch = require('cross-fetch');
//^allows us to use fetch from a node server(browser API-> uses Node Fetch)

//exchange code on the backend for a token (so it's hidden)
//code is how we are passing state from us->API (we need to pass some state in the URL)
//we use that token when we are making request to (github) API for users etc. From a resource API
//Authorization: access token, making requests on behalf of the user
//for this, access token gives us the keys to the user profile.
const exchangeCode = async (code) => {
  const tokenEx = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      //willing to accept the response in json format
      Accept: 'application/json',
      //sending content that's in json format
      'Content-Type': 'application/json',
    },
    //can't send raw JS object.
    //pass it an object to stringify.
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
    }),
  });
  //see the token parsed as json
  //destructor object to just get the token
  const { access_token } = await tokenEx.json();
  return access_token;
};

const getProfile = async (access_token) => {
  const profileReq = await fetch('https://api.github.com/user', {
    method: 'GET',
    //provide authorization to the api, using a token
    headers: {
      Accept: 'application/json',
      //this is from the docs. Token to let it know we are passing in a token.
      Authorization: `token ${access_token}`,
    },
  });
  //parse it as json
  const profile = await profileReq.json();
  return profile;
};

module.exports = { exchangeCode, getProfile };
