import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ParkingLot from '../models/ParkingLot.js';
import ParkingSlot from '../models/ParkingSlot.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ParkingLot.deleteMany({});
    await ParkingSlot.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin@123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@parking.com',
      password: adminPassword,
      role: 'admin',
    });
    await admin.save();

    // Create test user
    const userPassword = await bcrypt.hash('user@123', 10);
    const user = new User({
      name: 'Test User',
      email: 'user@parking.com',
      password: userPassword,
      role: 'user',
      phone: '1234567890',
      vehicleNumber: 'ABC-1234',
    });
    await user.save();

    // Create attendant
    const attendantPassword = await bcrypt.hash('attendant@123', 10);
    const attendant = new User({
      name: 'Parking Attendant',
      email: 'attendant@parking.com',
      password: attendantPassword,
      role: 'attendant',
      phone: '9876543210',
    });
    await attendant.save();

    // Create parking lots
    const lot1 = new ParkingLot({
      name: 'Downtown Parking',
      location: 'Downtown',
      address: '123 Main Street',
      totalSlots: 100,
      availableSlots: 100,
      city: 'New York',
      pricePerHour: 5,
      amenities: ['WiFi', 'CCTV', 'Charging Station'],
      createdBy: admin._id,
    });
    await lot1.save();

    const lot2 = new ParkingLot({
      name: 'Mall Parking',
      location: 'Shopping District',
      address: '456 Shopping Ave',
      totalSlots: 150,
      availableSlots: 150,
      city: 'New York',
      pricePerHour: 4,
      amenities: ['WiFi', 'Restroom', 'Food Court'],
      createdBy: admin._id,
    });
    await lot2.save();

    // Create parking slots for lot 1
    for (let i = 1; i <= 100; i++) {
      const type = i > 95 ? 'handicap' : i > 85 ? 'compact' : 'regular';
      const slot = new ParkingSlot({
        lotId: lot1._id,
        slotNumber: `A${String(i).padStart(3, '0')}`,
        type,
        status: 'AVAILABLE',
      });
      await slot.save();
    }

    // Create parking slots for lot 2
    for (let i = 1; i <= 150; i++) {
      const type = i > 140 ? 'handicap' : i > 120 ? 'compact' : 'regular';
      const slot = new ParkingSlot({
        lotId: lot2._id,
        slotNumber: `B${String(i).padStart(3, '0')}`,
        type,
        status: 'AVAILABLE',
      });
      await slot.save();
    }

    console.log('✅ Seed data created successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@parking.com / admin@123');
    console.log('User: user@parking.com / user@123');
    console.log('Attendant: attendant@parking.com / attendant@123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
