/**
 * ===================================
 * ARTHEA - COMMUNICATION MODULE
 * ===================================
 * PLIK: modules/communication/index.js
 * 
 * CO ROBI:
 * - Główny plik modułu komunikacji
 * - Eksportuje wszystkie routes
 * - Montuje w server.js jako /api/communication
 * 
 * NIE EDYTUJ chyba że dodajesz nowe podmoduły (chat, rounds, etc.)
 */

import express from 'express';
import commentsRoutes from './routes/comments.routes.js';
import chatRoutes from './routes/chat.routes.js';
import roundsRoutes from './routes/rounds.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';

const router = express.Router();

// ===================================
// MOUNT ROUTES
// ===================================

// Comments
router.use('/comments', commentsRoutes);

// Chat
router.use('/chat', chatRoutes);

// Rounds
router.use('/rounds', roundsRoutes);

// Notifications / Long polling
router.use('/notifications', notificationsRoutes);

// Test endpoint
router.get('/health', (req, res) => {
  res.json({
    module: 'communication',
    status: 'ok',
    version: '1.0.0',
    endpoints: {
      comments: '/api/communication/comments',
      chat: '/api/communication/chat',
      rounds: '/api/communication/rounds',
      notifications: '/api/communication/notifications'
    },
    features: {
      comments: 'Comments (draft, send, hide, team)',
      chat: 'Chat (client-architect, office, pins, mentions)',
      rounds: 'Rounds (create, freeze, close)',
      notifications: 'Long polling (real-time updates)'
    }
  });
});

export default router;