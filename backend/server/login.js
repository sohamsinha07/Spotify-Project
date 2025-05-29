
const express = require("express");
const router = express.Router();

require(`dotenv`).config();
const https = require("https");
const querystring = require("querystring");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = "https://test-spotify-site.local:5050/login/callback";

const generateRandomString = (length) => {
  let text = ``;
  const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const stateKey = `spotify_auth_state`;

router.get(`/`, (request, response) => {
  const state = generateRandomString(16);
  response.cookie(stateKey, state);

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-library-read",
  ].join(" ");

  const queryParams = querystring.stringify({
    client_id: clientId,
    response_type: `code`,
    redirect_uri: redirectURI,
    state: state,
    scope: scope,
  });
  response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

router.get(`/callback`, async (req, res) => {
  const code = req.query.code || null;

  const postData = querystring.stringify({
    grant_type: `authorization_code`,
    code: code,
    redirect_uri: redirectURI,
  });

  const options = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const parsedData = JSON.parse(data);

        if (response.statusCode === 200) {
          const { access_token, refresh_token, expires_in } = parsedData;

          const queryParams = querystring.stringify({
            access_token,
            refresh_token,
            expires_in,
          });

          res.redirect(`http://localhost:5173/?${queryParams}`);
        } else {
          res.redirect(
            `/?${querystring.stringify({ error: `invalid_token` })}`
          );
        }
      } catch (error) {
        res.redirect(`/?${querystring.stringify({ error: `parse_error` })}`);
      }
    });
  });

  request.on("error", (error) => {
    res.redirect(`/?${querystring.stringify({ error: `request_error` })}`);
  });

  request.write(postData);
  request.end();
});

module.exports = router;
