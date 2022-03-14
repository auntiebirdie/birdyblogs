const secrets = require('../secrets.json');
const express = require('express');
const router = express.Router();
const tumblr = require('tumblr.js');
const axios = require('axios');

router.post('/', (req, res) => {
  var blogs = [...new Set(req.body.blogs)];

  new Promise(async (resolve, reject) => {
    let promises = [];

    for (let blog of blogs) {
      promises.push(new Promise((resolve, reject) => {
        var client = new tumblr.Client({
          consumer_key: secrets.TUMBLR.OAUTH_KEY,
          consumer_secret: secrets.TUMBLR.OAUTH_SECRET,
          token: secrets.TUMBLR[secrets.TUMBLR[blog] ? blog : 'DEFAULT'].OAUTH_TOKEN,
          token_secret: secrets.TUMBLR[secrets.TUMBLR[blog] ? blog : 'DEFAULT'].OAUTH_TOKENSECRET
        });

        client.createPhotoPost(blog, {
          type: 'photo',
          state: req.body.species.length > 0 ? 'queue' : 'draft',
          tags: req.body.tags.join(',').toLowerCase(),
          source_url: req.body.source_url,
          source: req.body.source,
          caption: req.body.caption
        }, (err, response) => {
          resolve();
        })
      }));
    }

    Promise.all(promises).then(() => {
      resolve();
    });
  }).then(() => {
    var description = req.body.caption.replace(/\<\/p\>\<p\>/g, "\r\n\r\n").replace(/\<\/?p\>/g, '').replace(/\<\/?em\>/g, '*').replace('&copy;', ':copyright:');

    var url = description.match(/\<a href=\"([^\"]+)[^\>]+\>/);

    if (url && url.length > 1) {
      description = description.replace(/\<a [^\>]+\>/, '[').replace(/\<\/a\>/, `](${url[1]})`);
    } else {
      description = description.replace(/\<\/?a([^\>]+)?\>/g, '');
    }

    return axios({
      url: secrets.DISCORD.WEBHOOK.SUBMISSIONS,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {
        content: ' ',
        embeds: [{
          title: req.body.source_url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/im)[1],
          url: req.body.source_url,
          author: {
            name: blogs.join(', ')
          },
          description: description,
          image: {
            url: req.body.source
          },
          footer: {
            text: `submitted by @${req.session.user.name}`
          }
        }]
      }
    }).then((response) => {
      res.json('ok');
    }).catch((err) => {
      res.json({
        error: err
      });
    });
  });
});

module.exports = router;