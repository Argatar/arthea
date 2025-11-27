/**
 * ===================================
 * ARTHEA - CHAT ROUTES
 * ===================================
 * PLIK: modules/communication/routes/chat.routes.js
 * 
 * CO ROBI:
 * - Definiuje endpointy API dla czatu
 */

import express from 'express';
import chatController from '../controllers/chatController.js';

const router = express.Router();

// ===================================
// CHAT ENDPOINTS
// ===================================

/**
 * POST /api/communication/chat/client-architect
 * Wyślij wiadomość w czacie klient-architekt
 * 
 * Body:
 * {
 *   authorId: "uuid",
 *   authorName: "Jan Kowalski",
 *   authorRole: "client",
 *   content: "Czy możemy zmienić kolor ściany?"
 * }
 */
router.post('/client-architect', chatController.sendClientArchitect);

/**
 * POST /api/communication/chat/office
 * Wyślij wiadomość w czacie biura
 * 
 * Body:
 * {
 *   shotId: "uuid",           // opcjonalnie (null = globalny)
 *   authorId: "uuid",
 *   authorName: "Anna Architekt",
 *   authorRole: "architect",
 *   content: "@Kuba sprawdź draft v3",
 *   isPin: false              // true = pin na wizualizacji
 * }
 */
router.post('/office', chatController.sendOffice);

/**
 * GET /api/communication/chat/client-architect?limit=50&offset=0
 * Pobierz historię czatu klient-architekt
 */
router.get('/client-architect', chatController.getClientArchitectHistory);

/**
 * GET /api/communication/chat/office?limit=100&offset=0
 * Pobierz historię czatu biura
 */
router.get('/office', chatController.getOfficeHistory);

/**
 * GET /api/communication/chat/pins/:shotId
 * Pobierz piny dla ujęcia (office chat)
 */
router.get('/pins/:shotId', chatController.getPinsByShotId);

export default router;