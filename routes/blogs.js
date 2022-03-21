const express = require('express');
const router = express.Router();
const tumblr = require('../tumblr.js');

router.get('/', (req, res) => {
  res.render('blogs');
});

router.get('/:blog/:type(queue|posts|notifications)', (req, res) => {
  var client = tumblr.client(req.params.blog);

  res.render('blog', {
    blog: req.params.blog,
    type: req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1)
  });
});

router.get('/:blog/fetch/:type', (req, res) => {
  var client = tumblr.client(req.params.blog);

  client['blog' + req.params.type](req.params.blog, (err, response) => {
    res.json({
      err,
      response
    });
  });
});

router.post('/:blog/shuffle', (req, res) => {
  var client = tumblr.client(req.params.blog);

  client.shuffleQueue(req.params.blog, () => {
    res.json('ok');
  });
});

router.get('/:blog/:post', (req, res) => {
  var client = tumblr.client(req.params.blog);

  client.getPost(req.params.blog, req.params.post, (err, response) => {
    var post = response.posts[0];
    var attribution = post.caption.match(/\<a href="([^\"]+)[^\>]+\>(((?!<\/a>).)*)/);
    var species = post.caption.match(/\<p\>[^\<]+ \<em\>\(([^\)]+)\)\<\/em\>/);

    species.shift();

    res.render('form', {
      mode: 'edit',
      blog: req.params.blog,
      post: req.params.post,
      image: post.photos[0].original_size.url,
      source: post.source_url.replace('https://href.li/?', ''),
      attribution_url: attribution[1] || '',
      attribution_name: attribution[2] || '',
      species: species
    });
  });
});

router.post('/:blog/:post', (req, res) => {
  var client = tumblr.client(req.params.blog);

  client.editPost(req.params.blog, {
    id: req.params.post,
    tags: req.body.tags.join(',').toLowerCase(),
    caption: req.body.caption
  }, (err, response) => {
    res.json({
      error: err
    });
  });
});

router.delete('/:blog/:post', (req, res) => {
  var client = tumblr.client(req.params.blog);

  client.deletePost(req.params.blog, req.params.post, (err, response) => {
    res.json('ok');
  });
});

module.exports = router;