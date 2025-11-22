// this a model or schema which tells the structure of slow that is what could be stored in a slot and the datatypes
// Slot.js
const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  slotNumber: String,
  isOccupied: { type: Boolean, default: false },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminName: String, // Add this
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Slot', slotSchema);