/**
 * ===================================
 * ARTHEA - COMMENT SERVICE
 * ===================================
 * PLIK: modules/communication/services/commentService.js
 * 
 * CO ROBI:
 * - Logika biznesowa dla komentarzy
 * - Walidacja, zapis do bazy, wysyłanie emaili
 * 
 * EDYTUJ TEN PLIK JEŚLI:
 * - Chcesz zmienić zasady walidacji (np. max długość)
 * - Chcesz dodać nowe funkcje biznesowe
 * 
 * NIE RUSZAJ JEŚLI:
 * - Zmieniasz tylko wygląd UI (idź do frontend/css)
 */

import { v4 as uuidv4 } from 'uuid';
import db from '../../../config/database.js';
import { commentQueries, roundQueries } from '../db/queries.js';

class CommentService {
  
  /**
   * Waliduj komentarz
   */
  validateComment(content, positionX, positionY) {
    // Treść wymagana
    if (!content || content.trim().length === 0) {
      throw new Error('Komentarz nie może być pusty');
    }
    
    // Max długość (możesz zmienić)
    if (content.length > 2000) {
      throw new Error('Komentarz może mieć maksymalnie 2000 znaków');
    }
    
    // Waliduj pozycję pinu (jeśli podano)
    if (positionX !== null && positionX !== undefined) {
      if (positionX < 0 || positionX > 1) {
        throw new Error('Pozycja X musi być między 0 a 1');
      }
    }
    
    if (positionY !== null && positionY !== undefined) {
      if (positionY < 0 || positionY > 1) {
        throw new Error('Pozycja Y musi być między 0 a 1');
      }
    }
    
    return true;
  }
  
  /**
   * Dodaj komentarz (draft lokalny)
   */
  createDraft({
    roundId,
    shotId,
    versionId,
    authorType = 'client',
    authorId = null,
    authorName,
    authorEmail = null,
    content,
    positionX = null,
    positionY = null
  }) {
    // Walidacja
    this.validateComment(content, positionX, positionY);
    
    if (!roundId || !shotId) {
      throw new Error('roundId i shotId są wymagane');
    }
    
    if (authorType === 'client' && !authorName) {
      throw new Error('authorName jest wymagane dla klienta');
    }
    
    // Generuj ID
    const id = uuidv4();
    const now = Date.now();
    
    // Zapis do bazy
    try {
      commentQueries.create.run(
        id, roundId, shotId, versionId,
        authorType, authorId, authorName, authorEmail,
        content.trim(), positionX, positionY,
        now, now
      );
      
      return {
        id,
        roundId,
        shotId,
        versionId,
        authorType,
        authorId,
        authorName,
        authorEmail,
        content: content.trim(),
        positionX,
        positionY,
        status: 'draft',
        createdAt: now
      };
      
    } catch (error) {
      console.error('[CommentService] Error creating draft:', error);
      throw new Error('Nie udało się zapisać komentarza');
    }
  }
  
  /**
   * Pobierz drafty klienta (niewysłane)
   */
  getDraftsByShotId(shotId) {
    try {
      return commentQueries.getDraftsByShotId.all(shotId);
    } catch (error) {
      console.error('[CommentService] Error getting drafts:', error);
      throw new Error('Nie udało się pobrać komentarzy');
    }
  }
  
  /**
   * Wyślij komentarze do architekta (zbiorczy)
   */
  sendToArchitect(commentIds) {
    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      throw new Error('Brak komentarzy do wysłania');
    }
    
    const now = Date.now();
    
    try {
      // Zmień status wszystkich na "sent"
      const updateStmt = db.transaction((ids) => {
        for (const id of ids) {
          commentQueries.markAsSent.run(now, id);
        }
      });
      
      updateStmt(commentIds);
      
      // TODO: Wyślij email do architekta (implementacja w notificationService)
      
      return {
        sent: commentIds.length,
        sentAt: now
      };
      
    } catch (error) {
      console.error('[CommentService] Error sending comments:', error);
      throw new Error('Nie udało się wysłać komentarzy');
    }
  }
  
  /**
   * Pobierz komentarze dla ujęcia
   */
  getByShotId(shotId) {
    try {
      return commentQueries.getByShotId.all(shotId);
    } catch (error) {
      console.error('[CommentService] Error getting comments:', error);
      throw new Error('Nie udało się pobrać komentarzy');
    }
  }
  
  /**
   * Ukryj komentarz przed zespołem (architekt)
   */
  hideFromTeam(commentId, architectId) {
    const now = Date.now();
    
    try {
      commentQueries.hide.run(architectId, now, now, commentId);
      return { hidden: true, hiddenAt: now };
    } catch (error) {
      console.error('[CommentService] Error hiding comment:', error);
      throw new Error('Nie udało się ukryć komentarza');
    }
  }
  
  /**
   * Odkryj komentarz (pokaż zespołowi)
   */
  unhideFromTeam(commentId) {
    const now = Date.now();
    
    try {
      commentQueries.unhide.run(now, commentId);
      return { hidden: false };
    } catch (error) {
      console.error('[CommentService] Error unhiding comment:', error);
      throw new Error('Nie udało się odkryć komentarza');
    }
  }
  
  /**
   * Wyślij wybrane komentarze do zespołu (architekt)
   */
  sendToTeam(commentIds) {
    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      throw new Error('Brak komentarzy do wysłania');
    }
    
    const now = Date.now();
    
    try {
      const updateStmt = db.transaction((ids) => {
        for (const id of ids) {
          commentQueries.sendToTeam.run(now, now, id);
        }
      });
      
      updateStmt(commentIds);
      
      return {
        sent: commentIds.length,
        sentAt: now
      };
      
    } catch (error) {
      console.error('[CommentService] Error sending to team:', error);
      throw new Error('Nie udało się wysłać komentarzy do zespołu');
    }
  }
  
  /**
   * Pobierz komentarze do zatwierdzenia przez architekta
   */
  getPendingForTeam(shotId) {
    try {
      return commentQueries.getPendingForTeam.all(shotId);
    } catch (error) {
      console.error('[CommentService] Error getting pending:', error);
      throw new Error('Nie udało się pobrać komentarzy');
    }
  }
  
  /**
   * Pobierz komentarze widoczne dla zespołu
   */
  getVisibleForTeam(shotId) {
    try {
      return commentQueries.getVisibleForTeam.all(shotId);
    } catch (error) {
      console.error('[CommentService] Error getting visible:', error);
      throw new Error('Nie udało się pobrać komentarzy');
    }
  }
}

// Singleton
export default new CommentService();