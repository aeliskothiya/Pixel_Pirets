import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import ownerRoutes from './routes/ownerRoutes.js';
import coordinatorRoutes from './routes/coordinatorRoutes.js';

const app = express();

// Database Connection
connectDB().catch(err => {
  console.error('Database connection error:', err);
  console.log('App will continue running but database operations will fail');
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/owner', ownerRoutes);
app.use('/api/coordinator', coordinatorRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
