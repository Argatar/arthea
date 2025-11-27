/**
 * ===================================
 * ARTHEA - CHAT SERVICE
 * ===================================
 * PLIK: modules/communication/services/chatService.js
 * 
 * CO ROBI:
 * - Logika biznesowa dla czatu (klient-architekt + biuro)
 * - Walidacja, zapis wiadomości, mentions
 * 
 * EDYTUJ TEN PLIK JEŚLI:
 * - Chcesz zmienić zasady walidacji wiadomości
 * - Chcesz dodać nowe funkcje (np. reakcje emoji)
 */

import { v4 as uuidv4 } from 'uuid';
import { chatQueries } from '../db/queries.js';

class ChatService {
  
  /**
   * Waliduj wiadomość czatu
   */
  validateMessage(content) {
    if (!content || content.trim().length === 0) {
      throw new Error('Wiadomość nie może być pusta');
    }
    
    // Max długość (możesz zmienić)
    if (content.length > 5000) {
      throw new Error('Wiadomość może mieć maksymalnie 5000 znaków');
    }
    
    return true;
  }
  
  /**
   * Wyciągnij mentions z treści (@user)
   */
  extractMentions(content) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]); // bez @
    }
    
    return mentions.length > 0 ? JSON.stringify(mentions) : null;
  }
  
  /**
   * Dodaj wiadomość czatu (klient-architekt)
   */
  sendClientArchitectMessage({
    authorId,
    authorName,
    authorRole = 'client',
    content
  }) {
    // Walidacja
    this.validateMessage(content);
    
    if (!authorId || !authorName) {
      throw new Error('authorId i authorName są wymagane');
    }
    
    // Generuj ID
    const id = uuidv4();
    const now = Date.now();
    
    // Zapis do bazy
    try {
      chatQueries.create.run(
        id,
        'client_architect',
        null, // shotId (tylko dla office)
        authorId,
        authorName,
        authorRole,
        content.trim(),
        null, // mentions (tylko dla office)
        0, // is_pin (tylko dla office)
        now
      );
      
      return {
        id,
        conversationType: 'client_architect',
        authorId,
        authorName,
        authorRole,
        content: content.trim(),
        createdAt: now
      };
      
    } catch (error) {
      console.error('[ChatService] Error sending message:', error);
      throw new Error('Nie udało się wysłać wiadomości');
    }
  }
  
  /**
   * Dodaj wiadomość czatu biura (office)
   */
  sendOfficeMessage({
    shotId = null,
    authorId,
    authorName,
    authorRole = 'team',
    content,
    isPin = false
  }) {
    // Walidacja
    this.validateMessage(content);
    
    if (!authorId || !authorName) {
      throw new Error('authorId i authorName są wymagane');
    }
    
    // Wyciągnij mentions
    const mentions = this.extractMentions(content);
    
    // Generuj ID
    const id = uuidv4();
    const now = Date.now();
    
    // Zapis do bazy
    try {
      chatQueries.create.run(
        id,
        'office',
        shotId,
        authorId,
        authorName,
        authorRole,
        content.trim(),
        mentions,
        isPin ? 1 : 0,
        now
      );
      
      return {
        id,
        conversationType: 'office',
        shotId,
        authorId,
        authorName,
        authorRole,
        content: content.trim(),
        mentions: mentions ? JSON.parse(mentions) : [],
        isPin,
        createdAt: now
      };
      
    } catch (error) {
      console.error('[ChatService] Error sending office message:', error);
      throw new Error('Nie udało się wysłać wiadomości');
    }
  }
  
  /**
   * Pobierz historię czatu (klient-architekt)
   */
  getClientArchitectHistory(limit = 50, offset = 0) {
    try {
      const messages = chatQueries.getClientArchitect.all(limit, offset);
      return messages;
    } catch (error) {
      console.error('[ChatService] Error getting client-architect history:', error);
      throw new Error('Nie udało się pobrać historii czatu');
    }
  }
  
  /**
   * Pobierz historię czatu biura
   */
  getOfficeHistory(limit = 100, offset = 0) {
    try {
      const messages = chatQueries.getOffice.all(limit, offset);
      
      // Parsuj mentions (z JSON string na array)
      return messages.map(msg => ({
        ...msg,
        mentions: msg.mentions ? JSON.parse(msg.mentions) : []
      }));
    } catch (error) {
      console.error('[ChatService] Error getting office history:', error);
      throw new Error('Nie udało się pobrać historii czatu');
    }
  }
  
  /**
   * Pobierz piny dla ujęcia (office chat)
   */
  getPinsByShotId(shotId) {
    try {
      const pins = chatQueries.getPinsByShotId.all(shotId);
      
      return pins.map(pin => ({
        ...pin,
        mentions: pin.mentions ? JSON.parse(pin.mentions) : []
      }));
    } catch (error) {
      console.error('[ChatService] Error getting pins:', error);
      throw new Error('Nie udało się pobrać pinów');
    }
  }
  
  /**
   * Sprawdź czy użytkownik ma nowe wiadomości (dla long polling)
   */
  hasNewMessages(conversationType, lastCheckTimestamp) {
    try {
      const query = conversationType === 'client_architect'
        ? chatQueries.getClientArchitect
        : chatQueries.getOffice;
      
      // Pobierz ostatnią wiadomość
      const messages = query.all(1, 0);
      
      if (messages.length === 0) return false;
      
      return messages[0].created_at > lastCheckTimestamp;
      
    } catch (error) {
      console.error('[ChatService] Error checking new messages:', error);
      return false;
    }
  }
}

// Singleton
export default new ChatService();