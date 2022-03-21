const express = require('express');
const router = express.Router();
const tumblr = require('../tumblr.js');

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

  var client = tumblr.client();

  client.userInfo(async (err, data) => {
    var blogs = data.user.blogs.filter((blog) => blog.uuid != 't:o33AUE_nYjUs6pOa9n04iQ').map((blog) => {
      return {
        uuid: blog.uuid,
        name: blog.name,
        title: blog.title,
        avatar: blog.avatar.pop(),
        queue: blog.queue
      }
    });

    let otherBlogs = ['fullfrontalbirds'];

    for (let blog of otherBlogs) {
      var client = tumblr.client(blog);

      await new Promise((resolve, reject) => {
        client.userInfo((err, data) => {
          let blog = data.user.blogs[0];

          blogs.push({
            uuid: blog.uuid,
            name: blog.name,
            title: blog.title,
            avatar: blog.avatar.pop(),
            queue: blog.queue
          });

          resolve();
        });
      });
    }

    res.json(blogs.sort((a, b) => a.name.localeCompare(b.name)));
  });
});

module.exports = router;
