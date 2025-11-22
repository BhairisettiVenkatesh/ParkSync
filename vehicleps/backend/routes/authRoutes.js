
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const multer = require('multer');
const Slot = require('../models/Slot'); 


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};


router.post('/register', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, isAdmin });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    }
  });
});


router.post('/login', async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const user = await User.findOne({ email, isAdmin }); 
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials or role' });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photo: user.photo || ''
    }
  });
});

router.put('/profile', protect, upload.single('photo'), async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.isAdmin = req.body.isAdmin === 'true';

  if (req.file) {
    user.photo = `/uploads/${req.file.filename}`;
  }

  await user.save();

 
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    photo: user.photo || null,
  });
});



router.get('/providers', async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('_id name email');

    const enrichedAdmins = await Promise.all(
      admins.map(async (admin) => {
        const availableSlots = await Slot.countDocuments({
          adminId: admin._id,       
          isOccupied: false        
        });

        return {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          availableSlots
        };
      })
    );

    res.json(enrichedAdmins);
  } catch (err) {
    console.error('Error fetching providers with slots:', err);
    res.status(500).json({ message: 'Failed to load providers' });
  }
});

module.exports = router;
