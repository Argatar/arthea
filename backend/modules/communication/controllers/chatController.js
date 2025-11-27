/**
 * ===================================
 * ARTHEA - CHAT CONTROLLER
 * ===================================
 * PLIK: modules/communication/controllers/chatController.js
 * 
 * CO ROBI:
 * - Obsługuje HTTP requesty dla czatu
 * - Wywołuje chatService (logika biznesowa)
 */

import chatService from '../services/chatService.js';

class ChatController {
  
  /**
   * POST /api/communication/chat/client-architect
   * Wyślij wiadomość w czacie klient-architekt
   */
  async sendClientArchitect(req, res) {
    try {
      const { authorId, authorName, authorRole, content } = req.body;
      
      const message = chatService.sendClientArchitectMessage({
        authorId,
        authorName,
        authorRole,
        content
      });
      
      res.status(201).json({
        success: true,
        data: message
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * POST /api/communication/chat/office
   * Wyślij wiadomość w czacie biura
   */
  async sendOffice(req, res) {
    try {
      const { shotId, authorId, authorName, authorRole, content, isPin } = req.body;
      
      const message = chatService.sendOfficeMessage({
        shotId,
        authorId,
        authorName,
        authorRole,
        content,
        isPin
      });
      
      res.status(201).json({
        success: true,
        data: message
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/chat/client-architect?limit=50&offset=0
   * Pobierz historię czatu klient-architekt
   */
  async getClientArchitectHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      
      const messages = chatService.getClientArchitectHistory(limit, offset);
      
      res.json({
        success: true,
        data: messages,
        pagination: {
          limit,
          offset,
          total: messages.length
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/chat/office?limit=100&offset=0
   * Pobierz historię czatu biura
   */
  async getOfficeHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      
      const messages = chatService.getOfficeHistory(limit, offset);
      
      res.json({
        success: true,
        data: messages,
        pagination: {
          limit,
          offset,
          total: messages.length
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/chat/pins/:shotId
   * Pobierz piny dla ujęcia (office chat)
   */
  async getPinsByShotId(req, res) {
    try {
      const { shotId } = req.params;
      
      const pins = chatService.getPinsByShotId(shotId);
      
      res.json({
        success: true,
        data: pins
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new ChatController();