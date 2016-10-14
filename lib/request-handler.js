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
  console.log('not a function');
};

// exports.fetchLinks = function(req, res) {
//   Links.reset().fetch().then(function(links) {
//     res.status(200).send(links.models);
//   });
// };

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  config.Link.find({ url: uri }).then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
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
        newLink.save().then(function(err, newLink) {
          console.log('Error: ', err, 'NewLink: ', newLink);
          if (err) {
            console.log(err);
          }
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // console.log('top u and p', username, password);
  config.User.find({ username: username })
    .then(function(userArr) {
      console.log('we found', userArr);
      if (userArr.length === 0) {
        res.redirect('/login');
      } else {
        console.log('yooo franco my boyyy');
        console.log('username', userArr[0].username, 'password', userArr[0].password);

        var newUser = new config.User({
          username: userArr[0].username,
          password: userArr[0].password
        });
        console.log('NEWUSER PASS: ', newUser);
        newUser.comparePassword(password, function(match) {
          console.log("match", match);
          if (match) {
            console.log('franco you are good');
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
      console.log('USER: ', user);
      if (user.length === 0) {
        var newUser = new config.User({
          username: username,
          password: password
        });
        console.log('NEWUSER signup', newUser.password);
        newUser.save()
          .then(function(newUser) {
            console.log('newUser:', newUser);
            // User.add(newUser);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  console.log('not a function');
};

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
// };