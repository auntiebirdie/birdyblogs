const secrets = require('../secrets.json');
const express = require('express');
const router = express.Router();
const OAuth = require('oauth').OAuth;
const tumblr = require('tumblr.js');

const consumer = new OAuth("https://www.tumblr.com/oauth/request_token",
  "https://www.tumblr.com/oauth/access_token",
  secrets.TUMBLR.OAUTH_KEY,
  secrets.TUMBLR.OAUTH_SECRET,
  "1.0A",
  process.env.AUTH_CALLBACK || "https://birdyblogs-xettruih3a-uc.a.run.app/auth/callback",
  "HMAC-SHA1");

router.get('/', (req, res) => {
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
    if (error) {
      res.send("Error getting OAuth request token: " + error, 500);
    } else {
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;
      req.session.save(() => {
        res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauthToken);
      });
    }
  });
});

router.get('/callback', (req, res) => {
  consumer.getOAuthAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.query.oauth_verifier, function(error, _oauthAccessToken, _oauthAccessTokenSecret) {
    if (error) {
      console.log(error);
      res.send("Error getting OAuth access token: " + error, 500);
    } else {
      req.session.oauthToken = _oauthAccessToken;
      req.session.oauthTokenSecret = _oauthAccessTokenSecret;

      var client = new tumblr.Client({
        consumer_key: secrets.TUMBLR.OAUTH_KEY,
        consumer_secret: secrets.TUMBLR.OAUTH_SECRET,
        token: req.session.oauthToken,
        token_secret: req.session.oauthTokenSecret
      });

      client.userInfo(function(err, data) {
        if (data) {
          req.session.user = data.user;
          res.redirect('/');
        } else {
          res.render('error');
        }
      });
    }
  });
});

module.exports = router;
