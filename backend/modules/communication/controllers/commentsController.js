/**
 * ===================================
 * ARTHEA - COMMENTS CONTROLLER
 * ===================================
 * PLIK: modules/communication/controllers/commentsController.js
 * 
 * CO ROBI:
 * - Obsługuje HTTP requesty (Express route handlers)
 * - Wywołuje commentService (logika biznesowa)
 * - Zwraca odpowiedzi JSON
 * 
 * NIE EDYTUJ tego pliku chyba że dodajesz nowe endpointy
 */

import commentService from '../services/commentService.js';

class CommentsController {
  
  /**
   * POST /api/communication/comments/draft
   * Dodaj komentarz lokalnie (nie wysyła od razu)
   */
  async createDraft(req, res) {
    try {
      const {
        roundId,
        shotId,
        versionId,
        authorType,
        authorId,
        authorName,
        authorEmail,
        content,
        positionX,
        positionY
      } = req.body;
      
      const comment = commentService.createDraft({
        roundId,
        shotId,
        versionId,
        authorType,
        authorId,
        authorName,
        authorEmail,
        content,
        positionX,
        positionY
      });
      
      res.status(201).json({
        success: true,
        data: comment
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * POST /api/communication/comments/send
   * Wyślij wszystkie drafty do architekta (zbiorczy)
   */
  async sendToArchitect(req, res) {
    try {
      const { commentIds } = req.body;
      
      const result = commentService.sendToArchitect(commentIds);
      
      res.json({
        success: true,
        data: result,
        message: `Wysłano ${result.sent} komentarzy do architekta`
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/comments/:shotId
   * Pobierz komentarze dla ujęcia
   */
  async getByShotId(req, res) {
    try {
      const { shotId } = req.params;
      const comments = commentService.getByShotId(shotId);
      
      res.json({
        success: true,
        data: comments
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/comments/:shotId/drafts
   * Pobierz drafty klienta (niewysłane)
   */
  async getDraftsByShotId(req, res) {
    try {
      const { shotId } = req.params;
      const drafts = commentService.getDraftsByShotId(shotId);
      
      res.json({
        success: true,
        data: drafts
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * PATCH /api/communication/comments/:id/hide
   * Ukryj komentarz przed zespołem (architekt)
   */
  async hideFromTeam(req, res) {
    try {
      const { id } = req.params;
      const { architectId } = req.body; // TODO: z JWT token
      
      const result = commentService.hideFromTeam(id, architectId);
      
      res.json({
        success: true,
        data: result,
        message: 'Komentarz ukryty przed zespołem'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * PATCH /api/communication/comments/:id/unhide
   * Odkryj komentarz (pokaż zespołowi)
   */
  async unhideFromTeam(req, res) {
    try {
      const { id } = req.params;
      
      const result = commentService.unhideFromTeam(id);
      
      res.json({
        success: true,
        data: result,
        message: 'Komentarz widoczny dla zespołu'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * POST /api/communication/comments/send-to-team
   * Wyślij wybrane komentarze do zespołu (architekt)
   */
  async sendToTeam(req, res) {
    try {
      const { commentIds } = req.body;
      
      const result = commentService.sendToTeam(commentIds);
      
      res.json({
        success: true,
        data: result,
        message: `Wysłano ${result.sent} komentarzy do zespołu`
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/comments/:shotId/pending-for-team
   * Pobierz komentarze do zatwierdzenia przez architekta
   */
  async getPendingForTeam(req, res) {
    try {
      const { shotId } = req.params;
      const comments = commentService.getPendingForTeam(shotId);
      
      res.json({
        success: true,
        data: comments
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/comments/:shotId/visible-for-team
   * Pobierz komentarze widoczne dla zespołu
   */
  async getVisibleForTeam(req, res) {
    try {
      const { shotId } = req.params;
      const comments = commentService.getVisibleForTeam(shotId);
      
      res.json({
        success: true,
        data: comments
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new CommentsController();