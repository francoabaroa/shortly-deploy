// var db = require('../config');
// var crypto = require('crypto');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;


// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {

//   console.log('database opened UP');

//   var LinksSchema = new Schema({
//     visits: {
//       type: Number,
//       default: 0
//     }
//   });

//   LinksSchema.methods.initialize = function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }

//   var Link = mongoose.model('Link', LinksSchema);

// });

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
