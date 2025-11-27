/**
 * ===================================
 * ARTHEA - NOTIFICATION SERVICE
 * ===================================
 * PLIK: modules/communication/services/notificationService.js
 * 
 * CO ROBI:
 * - Long polling dla powiadomień
 * - Email notifications (TODO)
 * 
 * LONG POLLING FLOW:
 * 1. Frontend wysyła GET /poll?since=1234567890
 * 2. Backend czeka max 30s aż pojawią się nowe dane
 * 3. Jeśli są nowe dane → zwróć od razu
 * 4. Jeśli timeout 30s → zwróć "brak nowych"
 * 5. Frontend natychmiast robi kolejny request (loop)
 */

import { v4 as uuidv4 } from 'uuid';
import { notificationQueries, commentQueries, chatQueries } from '../db/queries.js';

class NotificationService {
  
  /**
   * Utwórz powiadomienie
   */
  createNotification({
    userId,
    type,
    targetId,
    content
  }) {
    if (!userId || !type) {
      throw new Error('userId i type są wymagane');
    }
    
    const id = uuidv4();
    const now = Date.now();
    
    try {
      notificationQueries.create.run(id, userId, type, targetId, content, now);
      
      return {
        id,
        userId,
        type,
        targetId,
        content,
        createdAt: now
      };
      
    } catch (error) {
      console.error('[NotificationService] Error creating notification:', error);
      throw new Error('Nie udało się utworzyć powiadomienia');
    }
  }
  
  /**
   * Long polling - czekaj na nowe powiadomienia
   * 
   * @param {string} userId - ID użytkownika
   * @param {number} since - Timestamp ostatniego sprawdzenia
   * @param {number} timeout - Max czas oczekiwania (ms), default 30s
   */
  async pollNotifications(userId, since, timeout = 30000) {
    const startTime = Date.now();
    const checkInterval = 1000; // sprawdzaj co 1s
    
    // Helper: sprawdź czy są nowe dane
    const checkForNew = () => {
      try {
        // Sprawdź nowe powiadomienia
        const notifications = notificationQueries.getNewSince.all(userId, since);
        
        if (notifications.length > 0) {
          return {
            hasNew: true,
            type: 'notification',
            data: notifications
          };
        }
        
        return null;
      } catch (error) {
        console.error('[NotificationService] Poll check error:', error);
        return null;
      }
    };
    
    // Loop: czekaj max `timeout` ms
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        // Timeout - zwróć "brak nowych"
        if (elapsed >= timeout) {
          clearInterval(interval);
          resolve({
            hasNew: false,
            timeout: true
          });
          return;
        }
        
        // Sprawdź nowe dane
        const result = checkForNew();
        
        if (result) {
          clearInterval(interval);
          resolve(result);
        }
      }, checkInterval);
    });
  }
  
  /**
   * Pobierz nowe powiadomienia (bez czekania)
   */
  getNewNotifications(userId, since) {
    try {
      const notifications = notificationQueries.getNewSince.all(userId, since);
      return notifications;
    } catch (error) {
      console.error('[NotificationService] Error getting notifications:', error);
      throw new Error('Nie udało się pobrać powiadomień');
    }
  }
  
  /**
   * Oznacz powiadomienie jako przeczytane
   */
  markAsRead(notificationId) {
    try {
      notificationQueries.markAsRead.run(notificationId);
      return { read: true };
    } catch (error) {
      console.error('[NotificationService] Error marking as read:', error);
      throw new Error('Nie udało się oznaczyć powiadomienia');
    }
  }
  
  /**
   * Helper: Wyślij powiadomienie o nowym komentarzu
   */
  notifyNewComment(userId, commentId, shotId) {
    return this.createNotification({
      userId,
      type: 'comment',
      targetId: commentId,
      content: `Nowy komentarz w ujęciu ${shotId}`
    });
  }
  
  /**
   * Helper: Wyślij powiadomienie o nowej wiadomości czatu
   */
  notifyNewChatMessage(userId, messageId) {
    return this.createNotification({
      userId,
      type: 'chat',
      targetId: messageId,
      content: 'Nowa wiadomość w czacie'
    });
  }
  
  /**
   * Helper: Wyślij powiadomienie o zamrożeniu rundy
   */
  notifyRoundFrozen(userId, roundId) {
    return this.createNotification({
      userId,
      type: 'round_frozen',
      targetId: roundId,
      content: 'Runda została zamrożona - komentowanie wstrzymane'
    });
  }
  
  /**
   * TODO: Wyślij email (nodemailer)
   */
  async sendEmail({ to, subject, html }) {
    // TODO: Implementacja nodemailer
    console.log('[NotificationService] Email would be sent:', { to, subject });
    
    // Przykład:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({ from: ..., to, subject, html });
    
    return { sent: true };
  }
}

// Singleton
export default new NotificationService();