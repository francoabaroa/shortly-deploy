var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var config = require('../app/config');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  config.Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  config.Link.find({ url: uri }).then(function(foundArr) {
    if (foundArr.length !== 0) {
      var newLink = config.Link({
        url: foundArr[0].url,
        title: foundArr[0].title,
        baseUrl: foundArr[0].baseUrl,
        visits: foundArr[0].visits,
        code: foundArr[0].code
      });
      res.status(200).send(newLink);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = config.Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });

        newLink.save().then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  config.User.find({ username: username })
    .then(function(userArr) {
      if (userArr.length === 0) {
        res.redirect('/login');
      } else {
        var newUser = new config.User({
          username: userArr[0].username,
          password: userArr[0].password
        });

        newUser.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, userArr);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  config.User.find({username: username})
    .then(function(user) {
      if (user.length === 0) {
        var newUser = new config.User({
          username: username,
          password: password
        });

        newUser.save()
          .then(function(newUser) {
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  config.Link.find({ code: req.params[0] }).then(function(linkArr) {
    if (linkArr.length === 0) {
      res.redirect('/');
    } else {
      linkArr[0].visits++;
      linkArr[0]
        .save()
        .then(function() {
          return res.redirect(linkArr[0].url);
        });
    }
  });
};