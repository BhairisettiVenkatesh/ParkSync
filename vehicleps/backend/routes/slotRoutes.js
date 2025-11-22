
const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const protect = require('../middleware/authMiddleware'); 
router.get('/', protect, async (req, res) => {
  try {
    let slots;

    if (req.user.isAdmin) {
      
      slots = await Slot.find({ adminId: req.user._id });
    } else {
      
      slots = await Slot.find({ isOccupied: false });
    }

    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ message: 'Failed to fetch slots' });
  }
});

router.put('/:id', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    const updatedSlot = await Slot.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json(updatedSlot);
  } catch (error) {
    console.error('Slot update error:', error);
    res.status(500).json({ message: 'Failed to update slot' });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { slotNumber } = req.body;

    
    const exists = await Slot.findOne({ slotNumber, adminId: req.user._id });
    if (exists) return res.status(400).json({ message: 'Slot already exists' });

    const newSlot = new Slot({
      slotNumber,
      adminId: req.user._id,
      adminName: req.user.name,
      isOccupied: false,
      bookedBy: null
    });

    const saved = await newSlot.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Slot creation error:', err);
    res.status(500).json({ message: 'Failed to add slot' });
  }
});


module.exports = router;
