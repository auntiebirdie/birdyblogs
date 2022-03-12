const secrets = require('../secrets.json');
const express = require('express');
const router = express.Router();
const tumblr = require('tumblr.js');

router.get('/birds', (req, res) => {
  const https = require('https');

  https.get('https://squawkoverflow.com/api/birds', (response) => {
    let body = "";

    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on("end", () => {
      res.json(JSON.parse(body));
    });
  });
});

router.get('/blogs', (req, res) => {
  var client = new tumblr.Client({
    consumer_key: secrets.TUMBLR.OAUTH_KEY,
    consumer_secret: secrets.TUMBLR.OAUTH_SECRET,
    token: secrets.TUMBLR.OAUTH_TOKEN,
    token_secret: secrets.TUMBLR.OAUTH_TOKENSECRET
  });

  client.userInfo((err, data) => {
    res.json(data.user.blogs.filter((blog) => blog.uuid != 't:o33AUE_nYjUs6pOa9n04iQ').map((blog) => {
      return {
        uuid: blog.uuid,
        name: blog.name,
        title: blog.title,
        avatar: blog.avatar.pop()
      }
    }));
  });
});

module.exports = router;
