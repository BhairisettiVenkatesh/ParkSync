🚗 ParkSync – Vehicle Parking Management System

ParkSync is a full-stack parking management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
It allows admins or security staff to manage vehicles, parking slots, payments, and user authentication efficiently.

📌 Features
✅ Vehicle Management

Add new vehicles

Update vehicle info

View all vehicles

Upload vehicle images

✅ Parking Slot Management

Add slots

Assign slots to vehicles

Track availability

✅ Payment & Amount Tracking

Store vehicle parking charges

Fetch total amount per vehicle

Update payment records

✅ Authentication

JWT-based login

Protected admin routes

✅ File Upload Support

Stores uploaded images inside /uploads

🛠️ Tech Stack
Frontend

React.js

CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB (Local)

Mongoose

JWT Authentication

Multer for file uploads

📂 Project Structure
ParkSync/
│
├── vehicleps/
│   ├── backend/
│   │   ├── routes/
│   │   │   ├── vehicleRoutes.js
│   │   │   ├── slotRoutes.js
│   │   │   ├── amountRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── uploads/
│   │   ├── server.js
│   │   └── .env
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│
└── README.md

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/BhairisettiVenkatesh/ParkSync.git
cd ParkSync/vehicleps/backend

🗄️ Backend Setup
2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file inside backend/:

MONGO_URI=mongodb://127.0.0.1:27017/vehicle-parking
JWT_SECRET=secret123
PORT=5000

4. Start the Backend
npm start


Backend runs at:

http://localhost:5000

🎨 Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🛣️ API Endpoints
Vehicle Routes /api/vehicles
POST /add
GET /all
GET /:id
PUT /update/:id
DELETE /delete/:id

Slot Routes /api/slots
POST /add
GET /all
PUT /assign/:id

Amount Routes /api/amounts
POST /add
GET /vehicle/:id

Auth Routes /api/auth
POST /register
POST /login
