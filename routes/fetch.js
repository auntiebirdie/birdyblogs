const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  axios.get(req.query.url, {})
    .then(async (response) => {
      var output = {};

      try {
        var $ = cheerio.load(response.data);
      } catch (err) {}

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
          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image"]').attr('content');
          output.attribution_name = $('a.owner-name').html();
          output.attribution_url = `https://flickr.com${$('a.owner-name').attr('href')}`;

          break;
        case 'unsplash.com':
        case 'www.unsplash.com':
          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image:secure_url"]').attr('content').split('?crop').shift() + '?w=1080';
          output.attribution_name = $('meta[property="og:title"]').attr('content').replace('Photo by', '').replace('on Unsplash', '').trim();
          output.attribution_url = "https://unsplash.com/" + $('meta[name="twitter:creator"]').attr('content');

          break;
        case 'danielslim.com':
        case 'www.danielslim.com':
          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('meta[property="og:image"]').attr('content');
          output.attribution_name = "Daniel Swee H Lim";
          output.attribution_url = "http://www.danielslim.com/";

          break;
        case 'pbase.com':
        case 'www.pbase.com':
          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('img', '#image').attr('src');
          output.attribution_name = $('a', '#localmenu').first().text();
          output.attribution_url = "https://www.pbase.com" + $('a', '#localmenu').first().attr('href');

          break;
        case 'feederwatch.org':
        case 'www.feederwatch.org':
          output.source = $('meta[property="og:url"]').attr('content');
          output.image = $('a', '.clomedia-slideshow-stage').attr('href');
          output.attribution_name = $('p', '.clomedia-info-div').first().text();
          output.attribution_url = output.source;

          break;
        default:
          return res.json({
            error: "That host isn't supported yet."
          });

          break;
      }

      res.json(output);
    }).catch((err) => {
      switch (err.response.status) {
        case 403:
          res.json({
            error: "That host does not allow their site to be scraped, but you can still enter the data manually."
          });
          break;
        default:
          res.json({
            error: "Something went wrong trying to fetch the URL provided."
          });
          break;
      }
    });
});

module.exports = router;
