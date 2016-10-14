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
    title: String,
    baseUrl: String
  });

  LinksSchema.methods.initialize = function() {
    this.on('creating', function(model, attrs, options) {
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }

  exports.Link = mongoose.model('Link', LinksSchema);

  //USERS
  var UsersSchema = new Schema({
    username: String,
    password: String
  });

  UsersSchema.pre('save', function (next) {
    // console.log(this, 'THIS', next, 'NEXT');
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        next();
      });
  });

  // UsersSchema.post('find', function(error, doc, next) {
  //   console.log('compare password called');
  //   bcrypt.compare(attemptedPassword, doc.password, function(err, isMatch) {
  //     next(isMatch);
  //   });
  // });

  UsersSchema.methods.initialize = function () {
    this.on('creating', this.hashPassword);
  }

  UsersSchema.methods.comparePassword = function(attemptedPassword, callback) {
    console.log('attempted', attemptedPassword, 'this password', this.password);
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      console.log('err', err, 'ismatch', isMatch);
      callback(isMatch);
    });
  }

  UsersSchema.methods.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }

  exports.User = mongoose.model('User', UsersSchema);


});



// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
// module.exports = db;
exports.db = db;
