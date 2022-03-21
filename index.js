const {
  Datastore
} = require('@google-cloud/datastore');
const {
  DatastoreStore
} = require('@google-cloud/connect-datastore');
const secrets = require('./secrets.json');
const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  store: new DatastoreStore({
    kind: 'birdyblogs-sessions',
    expirationMs: 0,
    dataset: new Datastore()
  }),
  secret: secrets.SESSION_TOKEN,
  key: 'birdyblogs.connect.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

app.use((req, res, next) => {
  var publicRoutes = [
    '/auth',
    '/auth/callback',
    '/api/blogs',
    '/logout'
  ];

  if (!req.session.user && !publicRoutes.includes(req.path)) {
    return res.redirect('/auth');
  }

  next();
});

app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/api', require('./routes/api.js'));
app.use('/blogs', require('./routes/blogs.js'));
app.use('/fetch', require('./routes/fetch.js'));
app.use('/submit', require('./routes/submit.js'));

app.listen(process.env.PORT || 8080, () => {});
