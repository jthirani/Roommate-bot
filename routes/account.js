var express = require('express')
var router = express.Router();
var express = require('express');
var bodyParser = require('body-parser');

var isAuthenticated = require('../middleware/isAuthenticated')

// Database
var Chore = require('../models/chore');
var User = require('../models/user');


router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var newUser = new User({ username: username, password:password});
  newUser.save(function (err, result) {
    if(!err) {
      req.session.user = result.username;
      res.redirect('/');
    } else {
      next(err);
    }
  })
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  User.findOne({ username: req.body.username, password: req.body.password }, function (err, user) {
    if (user !== null) {
      req.session.user = user.username;
      res.redirect('/');
    } else {
      res.send('incorrect credentials');
    }
  });
});

router.get('/logout', isAuthenticated, function (req, res, next) {
  req.session.user = '';
  res.redirect('/');
})

module.exports = router;
