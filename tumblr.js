const secrets = require('./secrets.json');
const tumblr = require('tumblr.js');

module.exports = {
  client: function(blog) {
    var client = new tumblr.Client({
      consumer_key: secrets.TUMBLR.OAUTH_KEY,
      consumer_secret: secrets.TUMBLR.OAUTH_SECRET,
      token: secrets.TUMBLR[secrets.TUMBLR[blog] ? blog : 'DEFAULT'].OAUTH_TOKEN,
      token_secret: secrets.TUMBLR[secrets.TUMBLR[blog] ? blog : 'DEFAULT'].OAUTH_TOKENSECRET
    });

    client.addGetMethods({
      blogNotifications: '/v2/blog/:blogIdentifier/notifications',
      getPost: ['/v2/blog/:blogIdentifier/posts', ['id']]
    });

    client.addPostMethods({
      shuffleQueue: '/v2/blog/:blogIdentifier/posts/queue/shuffle',
    });

    return client;
  }
}
