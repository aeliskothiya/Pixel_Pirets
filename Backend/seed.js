import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Coordinator from './models/Coordinator.js';

const backendEnvPath = path.resolve(process.cwd(), 'Backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else {
  dotenv.config();
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:lucifer_123@cluster0.pa3yeyv.mongodb.net/db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n⚠️  Make sure MongoDB is running!');
    console.error('   Run: mongod');
    process.exit(1);
  }
};

const seedCoordinator = async () => {
  try {
    await connectDB();

    // Check if coordinator already exists
    const existingCoordinator = await Coordinator.findOne({
      email: 'admin@pixelpirates.com'
    });

    if (existingCoordinator) {
      console.log('✅ Coordinator already exists!');
      console.log('   Email: admin@pixelpirates.com');
      console.log('   Password: admin@123');
      process.exit(0);
    }

    // Create new coordinator
    const coordinator = await Coordinator.create({
      name: 'Admin Coordinator',
      email: 'admin@pixelpirates.com',
      password: 'admin@123',
      role: 'coordinator'
    });

    console.log('✅ Coordinator created successfully!');
    console.log('   Email: admin@pixelpirates.com');
    console.log('   Password: admin@123');
    console.log('\n📝 You can now login with these credentials at:');
    console.log('   http://localhost:3000/coordinator/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedCoordinator();
