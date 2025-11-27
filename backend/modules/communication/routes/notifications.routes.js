/**
 * ===================================
 * ARTHEA - NOTIFICATIONS ROUTES
 * ===================================
 * PLIK: modules/communication/routes/notifications.routes.js
 * 
 * CO ROBI:
 * - Definiuje endpointy API dla powiadomień (long polling)
 */

import express from 'express';
import notificationsController from '../controllers/notificationsController.js';

const router = express.Router();

// ===================================
// NOTIFICATIONS ENDPOINTS
// ===================================

/**
 * GET /api/communication/notifications/poll?userId=uuid&since=1234567890
 * Long polling - czekaj na nowe powiadomienia (max 30s)
 * 
 * Query params:
 * - userId: ID użytkownika (TODO: z JWT)
 * - since: timestamp ostatniego sprawdzenia
 * - timeout: max czas oczekiwania (ms), default 30000
 * 
 * Response (jeśli są nowe):
 * {
 *   success: true,
 *   hasNew: true,
 *   type: "notification",
 *   data: [...],
 *   timestamp: 1234567890
 * }
 * 
 * Response (timeout):
 * {
 *   success: true,
 *   hasNew: false,
 *   timeout: true,
 *   timestamp: 1234567890
 * }
 */
router.get('/poll', notificationsController.poll);

/**
 * GET /api/communication/notifications?userId=uuid&since=1234567890
 * Pobierz nowe powiadomienia (bez czekania)
 */
router.get('/', notificationsController.getNotifications);

/**
 * PATCH /api/communication/notifications/:id/read
 * Oznacz powiadomienie jako przeczytane
 */
router.patch('/:id/read', notificationsController.markAsRead);

/**
 * POST /api/communication/notifications/test
 * Test endpoint - wyślij testowe powiadomienie
 * 
 * Body:
 * {
 *   userId: "uuid",
 *   type: "comment",
 *   content: "Test notification"
 * }
 */
router.post('/test', notificationsController.testNotification);

export default router;