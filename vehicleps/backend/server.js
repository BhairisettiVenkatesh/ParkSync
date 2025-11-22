const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicleRoutes');
const slotRoutes = require('./routes/slotRoutes');
const amountRoutes = require('./routes/amountRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/amounts', amountRoutes);
app.use('/api/auth', authRoutes); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
})
.catch(err => console.error(err));
