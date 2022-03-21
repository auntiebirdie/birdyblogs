const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let user = req.session.user;

  if (user?.blogs.find((blog) => blog.uuid == 't:9HVGjfdkURg5_Qk85MwsZQ' || blog.uuid == 't:o33AUE_nYjUs6pOa9n04iQ')) {
    res.render('form', {
	    mode: 'post'
    });
  } else {
    res.render('request');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/auth');
  });
});

module.exports = router;
