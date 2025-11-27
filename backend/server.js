/**
 * ===================================
 * ARTHEA - BACKEND SERVER
 * ===================================
 * GŁÓWNY PLIK SERWERA
 * 
 * CO ROBI:
 * - Startuje Express.js
 * - Ładuje middleware (CORS, compression, helmet)
 * - Montuje moduły (communication, projects, etc.)
 * - Nasłuchuje na porcie (domyślnie 5000)
 * 
 * URUCHOMIENIE:
 * - Development: npm run dev (auto-restart)
 * - Production: npm start (PM2: pm2 start server.js)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Załaduj .env
dotenv.config();

// Import modułów
import communicationRoutes from './modules/communication/index.js';

// Init Express
const app = express();
const PORT = process.env.PORT || 5000;

// ===================================
// MIDDLEWARE
// ===================================

// Security headers (helmet)
app.use(helmet());

// CORS (frontend może wysyłać requesty)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Compression (Gzip/Brotli)
app.use(compression());

// JSON body parser (max 10MB)
app.use(express.json({ limit: '10mb' }));

// URL-encoded body parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (prosty)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===================================
// ROUTES
// ===================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
});

// Moduł komunikacji
app.use('/api/communication', communicationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   ARTHEA BACKEND - RUNNING 🚀         ║
╠═══════════════════════════════════════╣
║  Port:        ${PORT}                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}             ║
║  API URL:     http://localhost:${PORT}   ║
║  Health:      /health                 ║
╚═══════════════════════════════════════╝
  `);
});