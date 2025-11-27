/**
 * ===================================
 * ARTHEA - COMMENTS ROUTES
 * ===================================
 * PLIK: modules/communication/routes/comments.routes.js
 * 
 * CO ROBI:
 * - Definiuje endpointy API dla komentarzy
 * - Montuje w server.js jako /api/communication/comments
 * 
 * EDYTUJ jeśli dodajesz nowe endpointy
 */

import express from 'express';
import commentsController from '../controllers/commentsController.js';

const router = express.Router();

// ===================================
// COMMENTS ENDPOINTS
// ===================================

/**
 * POST /api/communication/comments/draft
 * Dodaj komentarz lokalnie (draft)
 * 
 * Body:
 * {
 *   roundId: "uuid",
 *   shotId: "uuid",
 *   versionId: "uuid",
 *   authorName: "Jan Kowalski",
 *   authorEmail: "jan@example.com",
 *   content: "Za ciemno, rozjaśnij",
 *   positionX: 0.5,  // opcjonalnie
 *   positionY: 0.3   // opcjonalnie
 * }
 */
router.post('/draft', commentsController.createDraft);

/**
 * POST /api/communication/comments/send
 * Wyślij drafty do architekta (zbiorczy)
 * 
 * Body:
 * {
 *   commentIds: ["uuid1", "uuid2", "uuid3"]
 * }
 */
router.post('/send', commentsController.sendToArchitect);

/**
 * GET /api/communication/comments/:shotId
 * Pobierz wszystkie komentarze dla ujęcia
 */
router.get('/:shotId', commentsController.getByShotId);

/**
 * GET /api/communication/comments/:shotId/drafts
 * Pobierz drafty klienta (niewysłane)
 */
router.get('/:shotId/drafts', commentsController.getDraftsByShotId);

/**
 * PATCH /api/communication/comments/:id/hide
 * Ukryj komentarz przed zespołem (architekt)
 * 
 * Body:
 * {
 *   architectId: "uuid"
 * }
 */
router.patch('/:id/hide', commentsController.hideFromTeam);

/**
 * PATCH /api/communication/comments/:id/unhide
 * Odkryj komentarz (pokaż zespołowi)
 */
router.patch('/:id/unhide', commentsController.unhideFromTeam);

/**
 * POST /api/communication/comments/send-to-team
 * Wyślij wybrane komentarze do zespołu (architekt)
 * 
 * Body:
 * {
 *   commentIds: ["uuid1", "uuid2"]
 * }
 */
router.post('/send-to-team', commentsController.sendToTeam);

/**
 * GET /api/communication/comments/:shotId/pending-for-team
 * Pobierz komentarze do zatwierdzenia (architekt)
 */
router.get('/:shotId/pending-for-team', commentsController.getPendingForTeam);

/**
 * GET /api/communication/comments/:shotId/visible-for-team
 * Pobierz komentarze widoczne dla zespołu
 */
router.get('/:shotId/visible-for-team', commentsController.getVisibleForTeam);

export default router;