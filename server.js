var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
const handlebars = require('express-handlebars');
var accountRoutes = require('./routes/account.js');
var isAuthenticated = require('./middleware/isAuthenticated');

var app = express();

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/final-project');
app.use(express.static('assets'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'local-session',
  keys: ['yo'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', (req, res, next) => {
  res.render('home', {title: "Roommate", user: req.session.user});
});

app.use('/account', accountRoutes);

app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})

