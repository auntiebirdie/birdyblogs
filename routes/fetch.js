const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  axios.get(req.query.url)
    .then(async (response) => {
      var output = {};

      switch (response.request.connection._host) {
        case 'macaulaylibrary.org':
          output.source = response.data.specimenUrl;
          output.image = response.data.largeUrl;
          output.species = response.data.ebirdSpeciesUrl.split('/').pop();
          output.attribution_name = response.data.userDisplayName;
          output.attribution_url = response.data.userProfileUrl || `https://search.macaulaylibrary.org/catalog?userId=${response.data.userId}&searchField=user`;

          break;
        case 'flickr.com':
        case 'www.flickr.com':
          var $ = cheerio.load(response.data);

          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image"]').attr('content');
          output.attribution_name = $('a.owner-name').html();
          output.attribution_url = `https://flickr.com${$('a.owner-name').attr('href')}`;

          break;
        case 'unsplash.com':
        case 'www.unsplash.com':
          var $ = cheerio.load(response.data);

          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image:secure_url"]').attr('content').split('?crop').shift() + '?w=1080';
          output.attribution_name = $('meta[property="og:title"]').attr('content').replace('Photo by', '').replace('on Unsplash', '').trim();
          output.attribution_url = "https://unsplash.com/" + $('meta[name="twitter:creator"]').attr('content');

          break;
        case 'danielslim.com':
        case 'www.danielslim.com':
          var $ = cheerio.load(response.data);

          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image"]').attr('content');
          output.attribution_name = "Daniel Swee H Lim";
          output.attribution_url = "http://www.danielslim.com/";

          break;
        case 'pbase.com':
        case 'www.pbase.com':
          var $ = cheerio.load(response.data);

          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('img', '#image').attr('src');
          output.attribution_name = $('a', '#localmenu').first().text();
          output.attribution_url = "https://www.pbase.com" + $('a', '#localmenu').first().attr('href');

          break;
        default:
          return res.json({
            error: "That host isn't supported yet."
          });

          break;
      }

      res.json(output);
    }).catch((err) => {
      res.json({
	      error: "Something went wrong trying to fetch the URL provided."
      });
    });
});

module.exports = router;
