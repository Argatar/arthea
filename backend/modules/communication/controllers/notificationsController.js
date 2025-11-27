/**
 * ===================================
 * ARTHEA - NOTIFICATIONS CONTROLLER
 * ===================================
 * PLIK: modules/communication/controllers/notificationsController.js
 * 
 * CO ROBI:
 * - Obsługuje long polling dla powiadomień
 */

import notificationService from '../services/notificationService.js';

class NotificationsController {
  
  /**
   * GET /api/communication/notifications/poll?since=1234567890
   * Long polling - czekaj na nowe powiadomienia (max 30s)
   * 
   * Query params:
   * - since: timestamp ostatniego sprawdzenia
   * - timeout: max czas oczekiwania (ms), default 30000
   */
  async poll(req, res) {
    try {
      const userId = req.query.userId; // TODO: z JWT token
      const since = parseInt(req.query.since) || Date.now();
      const timeout = parseInt(req.query.timeout) || 30000;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagane'
        });
      }
      
      // Long polling (czeka max 30s)
      const result = await notificationService.pollNotifications(
        userId,
        since,
        timeout
      );
      
      res.json({
        success: true,
        ...result,
        timestamp: Date.now()
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/notifications?since=1234567890
   * Pobierz nowe powiadomienia (bez czekania)
   */
  async getNotifications(req, res) {
    try {
      const userId = req.query.userId; // TODO: z JWT token
      const since = parseInt(req.query.since) || 0;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagane'
        });
      }
      
      const notifications = notificationService.getNewNotifications(userId, since);
      
      res.json({
        success: true,
        data: notifications,
        timestamp: Date.now()
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * PATCH /api/communication/notifications/:id/read
   * Oznacz powiadomienie jako przeczytane
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      const result = notificationService.markAsRead(id);
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * POST /api/communication/notifications/test
   * Test endpoint - wyślij testowe powiadomienie
   */
  async testNotification(req, res) {
    try {
      const { userId, type, content } = req.body;
      
      const notification = notificationService.createNotification({
        userId,
        type: type || 'comment',
        targetId: 'test-target-id',
        content: content || 'Test notification'
      });
      
      res.json({
        success: true,
        data: notification,
        message: 'Powiadomienie testowe utworzone'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new NotificationsController();