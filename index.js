const secrets = require('./secrets.json');
const express = require('express');
const session = require('express-session')
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: secrets.SESSION_TOKEN,
  key: 'birdyblogs.connect.sid',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  if (!req.session.user && !req.path.startsWith('/auth')) {
    return res.redirect('/auth');
  }

  next();
});

app.get('/', (req, res) => {
  let user = req.session.user;

  if (user.blogs.find((blog) => blog.uuid == 't:9HVGjfdkURg5_Qk85MwsZQ' || blog.uuid == 't:o33AUE_nYjUs6pOa9n04iQ')) {
    res.render('index');
  } else {
    res.render('request');
  }
});

app.use('/auth', require('./routes/auth.js'));
app.use('/api', require('./routes/api.js'));
app.use('/fetch', require('./routes/fetch.js'));
app.use('/submit', require('./routes/submit.js'));

app.listen(process.env.PORT || 8080, () => {});
