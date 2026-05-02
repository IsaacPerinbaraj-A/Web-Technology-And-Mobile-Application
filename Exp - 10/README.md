# Smart Parking Management System

A complete, production-ready full-stack web application for managing parking lots and reservations with real-time updates using WebSockets.

## 🎯 Features

### User Features
- ✅ User registration & login with JWT authentication
- ✅ View all parking lots with real-time availability
- ✅ Book parking slots with instant confirmation
- ✅ Cancel bookings with automatic slot release
- ✅ View booking history and active bookings
- ✅ QR code generation for parking entry
- ✅ Profile management
- ✅ Real-time slot status updates via WebSocket

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Create and manage parking lots
- ✅ View all users and block/unblock them
- ✅ View all bookings and system stats
- ✅ Revenue reports
- ✅ Audit logs
- ✅ Real-time monitoring of parking occupancy

### System Features
- ✅ Real-time WebSocket updates for slot availability
- ✅ Double booking prevention with atomic operations
- ✅ Automatic booking expiration (30 minutes timeout)
- ✅ Entry/exit time tracking
- ✅ Cost calculation based on parking duration
- ✅ Role-based access control (User, Admin, Attendant)
- ✅ Complete audit logging

## 🏗️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (Atlas)
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - WebSocket client
- **QRCode.react** - QR code display

## 📋 Project Structure

```
WTMA Project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── ParkingLot.js
│   │   ├── ParkingSlot.js
│   │   ├── Booking.js
│   │   └── AuditLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── parkingLotController.js
│   │   ├── parkingSlotController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── parkingLotRoutes.js
│   │   ├── parkingSlotRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── parkingLotService.js
│   │   ├── parkingSlotService.js
│   │   └── bookingService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── userStatus.js
│   ├── config/
│   │   ├── database.js
│   │   └── socket.js
│   ├── utils/
│   │   └── helpers.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Alert.jsx
    │   │   ├── SlotGrid.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── SlotsPage.jsx
    │   │   ├── BookingConfirmationPage.jsx
    │   │   ├── MyBookingsPage.jsx
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── AdminUsersPage.jsx
    │   │   ├── AdminBookingsPage.jsx
    │   │   └── AdminLotsPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ParkingContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your MongoDB connection string:**
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/smart-parking?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_make_it_random_and_long
PORT=5000
```

5. **Seed the database with test data:**
```bash
npm run seed
```

6. **Start the backend server:**
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env.local file:**
```bash
cp .env.example .env.local
```

4. **Start the development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Demo Credentials

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@parking.com`
- Password: `admin@123`

**User Account:**
- Email: `user@parking.com`
- Password: `user@123`

**Attendant Account:**
- Email: `attendant@parking.com`
- Password: `attendant@123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Parking Lots
- `GET /api/parking/lots` - Get all parking lots
- `GET /api/parking/lots/:lotId` - Get specific lot
- `GET /api/parking/lots/:lotId/occupancy` - Get lot occupancy
- `POST /api/parking/lots` - Create parking lot (Admin only)
- `PUT /api/parking/lots/:lotId` - Update parking lot (Admin only)

### Parking Slots
- `GET /api/parking/slots/lot/:lotId` - Get slots for a lot
- `GET /api/parking/slots/:slotId` - Get specific slot
- `POST /api/parking/slots/lot/:lotId` - Create slot (Admin only)
- `DELETE /api/parking/slots/:slotId` - Delete slot (Admin only)

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/user/active` - Get active booking
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/code/:bookingId` - Get booking by booking ID
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `POST /api/bookings/entry/mark` - Mark vehicle entry
- `POST /api/bookings/exit/mark` - Mark vehicle exit

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/revenue` - Get revenue report
- `GET /api/admin/audit-logs` - Get audit logs
- `PUT /api/auth/users/:userId/block` - Block user
- `PUT /api/auth/users/:userId/unblock` - Unblock user

## 🔄 WebSocket Events

### Emit (from client)
- `joinLot(lotId)` - Join a parking lot room
- `leaveLot(lotId)` - Leave a parking lot room

### Listen (on client)
- `slotUpdated` - Slot status changed
- `bookingCreated` - New booking created
- `bookingCancelled` - Booking cancelled
- `bookingExpired` - Booking expired (timeout)

## 🔒 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - bcrypt with salt rounds
3. **Role-Based Access Control** - User, Admin, Attendant roles
4. **Double Booking Prevention** - Atomic database operations
5. **Input Validation** - Express validator middleware
6. **CORS Protection** - Configured CORS with credentials
7. **Audit Logging** - All critical actions logged
8. **User Status Check** - Blocked users cannot book

## 🎨 Key Features Implementation

### Real-Time Slot Updates
Slots are updated in real-time using Socket.io. When a user books, cancels, or exits a slot, all connected clients are notified instantly.

### Double Booking Prevention
Uses MongoDB sessions for atomic transactions. When a booking is created, the system checks availability and reserves the slot in a single operation.

### Booking Timeout
Reservations automatically expire after 30 minutes if not confirmed by marking entry. This prevents users from hoarding slots.

### Cost Calculation
Automatically calculates parking costs based on:
- Entry and exit times
- Hourly rate set by the lot
- Duration rounded up to the nearest hour

## 🧪 Testing the System

1. **Create a parking lot** (as admin)
2. **Login as user** and view the lot
3. **Book a slot** from the available slots
4. **Confirm the booking** with QR code
5. **View booking confirmation** page
6. **Cancel the booking** to test slot release
7. **Check real-time updates** across multiple browser tabs

## 📦 Building for Production

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

The built frontend will be in the `dist` folder.

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB connection string
- Check whitelist IP address in MongoDB Atlas
- Ensure network access is allowed

**Socket.io Connection Error:**
- Check CORS origin in backend config
- Ensure backend is running on port 5000
- Check browser console for connection errors

**Booking Timeout:**
- Default timeout is 30 minutes
- Change `BOOKING_TIMEOUT_MINUTES` in .env
- Restart backend after changing

**CORS Issues:**
- Update `SOCKET_IO_CORS_ORIGIN` in backend .env
- Ensure frontend URL matches

## 📝 Notes

- The system prevents double booking using atomic transactions
- All timestamps use ISO 8601 format
- QR codes are generated as data URLs (embedded in response)
- Real-time updates work across all connected clients
- Admin can manage all aspects from the admin dashboard

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions, please check the code comments and documentation within each file.

---

**Built with ❤️ - A complete Smart Parking Management System**
