import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedDatabase } from './services/seederService';

import transactionRoutes from './routes/transactionRoutes';
import webhookRoutes from './routes/webhookRoutes';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/transactions', transactionRoutes); // Fallback path as requested in PDF spec
app.use('/api/webhook', webhookRoutes);
app.use('/webhook', webhookRoutes); // Fallback path as requested in PDF spec
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Database Seeding Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    await seedDatabase(force);
    return res.status(200).json({ success: true, message: 'Database seeded successfully!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'School Payment Backend API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to School Payment & Dashboard REST API',
    endpoints: {
      transactions: '/api/transactions',
      transactions_by_school: '/api/transactions/school/:school_id',
      check_status: '/api/transactions/status/:custom_order_id',
      webhook: '/api/webhook',
      manual_update: '/api/transactions/manual-update',
      create_payment: '/api/payment/create-collect-request',
      analytics: '/api/transactions/analytics',
      auth: '/api/auth/login',
    },
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  await seedDatabase(false);

  app.listen(PORT, () => {
    console.log(`🚀 School Payment Backend Service running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
