var path = require('path');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var db = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  console.log('database opened UP');

  //LINKS
  var LinksSchema = new Schema({
    visits: {
      type: Number,
      default: 0
    },
    url: String,
    code: String,
    title: String,
    baseUrl: String
  });

  LinksSchema.pre('save', function(next) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
  });

  exports.Link = mongoose.model('Link', LinksSchema);

  //USERS
  var UsersSchema = new Schema({
    username: String,
    password: String
  });

  UsersSchema.pre('save', function (next) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        next();
      });
  });

  UsersSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  }

  exports.User = mongoose.model('User', UsersSchema);


});

exports.db = db;
