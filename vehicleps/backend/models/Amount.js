// // const mongoose = require('mongoose');

// // const amountSchema = new mongoose.Schema({
// //   number: String,
// //   owner: String,
// //   slot: String,
// //   parkedAt: Date,
// //   exitedAt: { type: Date, default: Date.now },
// //   totalAmount: Number
// // });

// // module.exports = mongoose.model('Amount', amountSchema);

// const mongoose = require('mongoose');

// const amountSchema = new mongoose.Schema({
//   number: String,
//   owner: String,
//   slot: String,
//   parkedAt: Date,
//   exitedAt: {
//     type: Date,
//     default: Date.now
//   },
//   totalAmount: Number,
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// });

// module.exports = mongoose.model('Amount', amountSchema);

const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
  number: String,
  owner: String,
  slot: String,
  parkedAt: Date,
  exitedAt: Date,
  totalAmount: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paid: {
    type: Boolean,
    default: false  // initially not paid
  }
});

module.exports = mongoose.model('Amount', amountSchema);
