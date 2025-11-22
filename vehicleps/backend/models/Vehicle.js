// // // this a model or schema of vehicle, that is what could be stored in a vehicle and the data types
// // // Vehicle.js
// const mongoose = require('mongoose');
// const vehicleSchema = new mongoose.Schema({
//   number: String,
//   owner: String,
//   slot: String,
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   parkedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Vehicle', vehicleSchema);

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  number: String,
  owner: String,
  slot: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parkedAt: {
    type: Date,
    default: Date.now
  },
  notified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
