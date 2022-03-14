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
  res.setHeader('Access-Control-Allow-Origin', '*');

  var client = new tumblr.Client({
    consumer_key: secrets.TUMBLR.OAUTH_KEY,
    consumer_secret: secrets.TUMBLR.OAUTH_SECRET,
    token: secrets.TUMBLR.DEFAULT.OAUTH_TOKEN,
    token_secret: secrets.TUMBLR.DEFAULT.OAUTH_TOKENSECRET
  });

  client.userInfo((err, data) => {
    let blogs = data.user.blogs.filter((blog) => blog.uuid != 't:o33AUE_nYjUs6pOa9n04iQ').map((blog) => {
      return {
        uuid: blog.uuid,
        name: blog.name,
        title: blog.title,
        avatar: blog.avatar.pop()
      }
    });

    blogs.push({
      uuid: 't:edLv0reDrqUQrowliZVQDw',
      name: 'fullfrontalbirds',
      title: 'full frontal birds',
      avatar: { width: 64, url : 'https://64.media.tumblr.com/avatar_ec481e600259_64.png' }
    });

    res.json(blogs);
  });
});

module.exports = router;
