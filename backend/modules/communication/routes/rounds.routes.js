/**
 * ===================================
 * ARTHEA - ROUNDS ROUTES
 * ===================================
 * PLIK: modules/communication/routes/rounds.routes.js
 * 
 * CO ROBI:
 * - Definiuje endpointy API dla rund
 */

import express from 'express';
import roundsController from '../controllers/roundsController.js';

const router = express.Router();

// ===================================
// ROUNDS ENDPOINTS
// ===================================

/**
 * POST /api/communication/rounds
 * Utwórz nową rundę
 * 
 * Body:
 * {
 *   shotId: "uuid"
 * }
 */
router.post('/', roundsController.createRound);

/**
 * GET /api/communication/rounds/:id
 * Pobierz rundę po ID
 */
router.get('/:id', roundsController.getRoundById);

/**
 * GET /api/communication/rounds/shot/:shotId/active
 * Pobierz aktywną rundę dla ujęcia
 */
router.get('/shot/:shotId/active', roundsController.getActiveRound);

/**
 * PATCH /api/communication/rounds/:id/freeze
 * Zamroź rundę (wstrzymaj komentowanie)
 */
router.patch('/:id/freeze', roundsController.freezeRound);

/**
 * PATCH /api/communication/rounds/:id/close
 * Zamknij rundę (finalizacja)
 */
router.patch('/:id/close', roundsController.closeRound);

/**
 * GET /api/communication/rounds/:id/status
 * Pobierz status rundy
 */
router.get('/:id/status', roundsController.getRoundStatus);

export default router;