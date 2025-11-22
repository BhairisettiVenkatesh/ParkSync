
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Amount = require('../models/Amount');
const protect = require('../middleware/authMiddleware');


router.get('/', protect, async (req, res) => {
  let vehicles;

  if (req.user.isAdmin) {
    
    vehicles = await Vehicle.find().populate('userId', 'name email');
  } else {
    
    vehicles = await Vehicle.find({ userId: req.user._id });
  }

  res.json(vehicles);
});



router.post('/', protect, async (req, res) => {
  try {
    const { number, owner, slot } = req.body;

    if (!number || !owner || !slot) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const vehicle = await Vehicle.create({
      number,
      owner,
      slot,
      parkedAt: new Date(),
      userId: req.user._id 
    });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Vehicle create error:', err);
    res.status(500).json({ message: 'Server error creating vehicle' });
  }
});


router.put('/:id/notify', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

   
    if (vehicle.notified) {
      return res.status(400).json({ message: 'Already notified' });
    }

    
    const parkedAt = vehicle.parkedAt || new Date();
    const exitedAt = new Date();
    const hours = Math.ceil((exitedAt - parkedAt) / (1000 * 60 * 60));
    const totalAmount = hours * 10;

    
    await Amount.create({
      number: vehicle.number,
      owner: vehicle.owner,
      slot: vehicle.slot,
      parkedAt,
      exitedAt,
      totalAmount,
      userId: vehicle.userId,
      paid: false
    });

    
    vehicle.notified = true;
    await vehicle.save();

    res.json({ message: 'Vehicle notified and amount created' });
  } catch (err) {
    console.error('Notify error:', err);
    res.status(500).json({ message: 'Failed to notify user' });
  }
});




module.exports = router;
