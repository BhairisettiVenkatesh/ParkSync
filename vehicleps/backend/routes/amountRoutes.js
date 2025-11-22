const express = require('express');
const router = express.Router();
const Amount = require('../models/Amount');
const Vehicle = require('../models/Vehicle'); 
const protect = require('../middleware/authMiddleware');
const Slot = require('../models/Slot');


router.get('/', protect, async (req, res) => {
  try {
    let amounts;

    if (req.user.isAdmin) {
     
      amounts = await Amount.find().populate('userId', 'name email').sort({ exitedAt: -1 });
    } else {
     
      amounts = await Amount.find({ userId: req.user._id }).sort({ exitedAt: -1 });
    }

    res.json(amounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch amounts' });
  }
});


router.patch('/:id/pay', protect, async (req, res) => {
  try {
    const amount = await Amount.findById(req.params.id);

    if (!amount) {
      return res.status(404).json({ message: 'Amount not found' });
    }

    if (amount.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    
    amount.paid = true;
    await amount.save();

    
    const slot = await Slot.findOne({ slotNumber: amount.slot });
    if (slot && slot.isOccupied) {
      slot.isOccupied = false;
      slot.bookedBy = null;
      await slot.save();
    }

    res.json({ message: 'Marked as paid and slot updated if necessary' });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Failed to mark as paid' });
  }
});




router.delete('/:id', protect, async (req, res) => {
  try {
    const amount = await Amount.findById(req.params.id);
    if (!amount) return res.status(404).json({ message: 'Amount not found' });

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admin can delete paid records' });
    }

   
    const vehicle = await Vehicle.findOne({
      number: amount.number,
      userId: amount.userId,
    });

    if (vehicle) {
      await vehicle.deleteOne(); 
    } else {
      console.warn(`Vehicle not found for amount ID: ${amount._id}`);
    }

     
    const slot = await Slot.findOne({ slotNumber: amount.slot });
    if (slot) {
      slot.isOccupied = false;
      slot.bookedBy = null;
      await slot.save();
    } else {
      console.warn(`Slot not found for slotNumber: ${amount.slot}`);
    }

    await amount.deleteOne(); 
    res.json({ message: 'Payment completed and user booking deleted.' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete record' });
  }
});


module.exports = router;
