// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;


// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {

//   console.log('database opened UP');

//   var UsersSchema = new Schema({
//     username: String,
//     password: String
//   });

//   UsersSchema.methods.initialize = function () {
//     this.on('creating', this.hashPassword);
//   }

//   UsersSchema.methods.comparePassword = function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   }

//   UsersSchema.methods.hashPassword = function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }

//   var User = mongoose.model('User', UsersSchema);

// });



// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });


// module.exports = User;
