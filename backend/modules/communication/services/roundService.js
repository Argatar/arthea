/**
 * ===================================
 * ARTHEA - ROUND SERVICE
 * ===================================
 * PLIK: modules/communication/services/roundService.js
 * 
 * CO ROBI:
 * - Logika biznesowa dla rund poprawek
 * - Tworzenie, zamrażanie, zamykanie rund
 * 
 * EDYTUJ TEN PLIK JEŚLI:
 * - Chcesz zmienić workflow rund
 * - Chcesz dodać nowe statusy
 */

import { v4 as uuidv4 } from 'uuid';
import { roundQueries } from '../db/queries.js';

class RoundService {
  
  /**
   * Utwórz nową rundę
   */
  createRound(shotId) {
    if (!shotId) {
      throw new Error('shotId jest wymagane');
    }
    
    try {
      // Pobierz ostatnią rundę dla tego shot'a
      const lastRound = roundQueries.getActiveByShotId.get(shotId);
      
      // Jeśli jest aktywna runda, nie można stworzyć nowej
      if (lastRound && lastRound.status !== 'closed') {
        throw new Error('Nie można stworzyć nowej rundy - zamknij poprzednią');
      }
      
      // Numer rundy (poprzednia + 1 lub 1)
      const roundNumber = lastRound ? lastRound.round_number + 1 : 1;
      
      // Generuj ID
      const id = uuidv4();
      const now = Date.now();
      
      // Zapis do bazy
      roundQueries.create.run(id, shotId, roundNumber, now);
      
      return {
        id,
        shotId,
        roundNumber,
        status: 'open',
        createdAt: now
      };
      
    } catch (error) {
      console.error('[RoundService] Error creating round:', error);
      throw new Error(error.message || 'Nie udało się utworzyć rundy');
    }
  }
  
  /**
   * Pobierz rundę po ID
   */
  getRoundById(roundId) {
    try {
      const round = roundQueries.getById.get(roundId);
      
      if (!round) {
        throw new Error('Nie znaleziono rundy');
      }
      
      return round;
    } catch (error) {
      console.error('[RoundService] Error getting round:', error);
      throw new Error('Nie udało się pobrać rundy');
    }
  }
  
  /**
   * Pobierz aktywną rundę dla ujęcia
   */
  getActiveRoundByShotId(shotId) {
    try {
      const round = roundQueries.getActiveByShotId.get(shotId);
      return round || null;
    } catch (error) {
      console.error('[RoundService] Error getting active round:', error);
      throw new Error('Nie udało się pobrać aktywnej rundy');
    }
  }
  
  /**
   * Zamroź rundę (wstrzymaj komentowanie)
   */
  freezeRound(roundId) {
    try {
      // Sprawdź czy runda istnieje i jest otwarta
      const round = this.getRoundById(roundId);
      
      if (round.status !== 'open') {
        throw new Error('Można zamrozić tylko otwartą rundę');
      }
      
      const now = Date.now();
      
      // Zamroź
      roundQueries.freeze.run(now, roundId);
      
      return {
        id: roundId,
        status: 'frozen',
        frozenAt: now
      };
      
    } catch (error) {
      console.error('[RoundService] Error freezing round:', error);
      throw new Error(error.message || 'Nie udało się zamrozić rundy');
    }
  }
  
  /**
   * Zamknij rundę (finalizacja)
   */
  closeRound(roundId) {
    try {
      // Sprawdź czy runda istnieje
      const round = this.getRoundById(roundId);
      
      if (round.status === 'closed') {
        throw new Error('Runda jest już zamknięta');
      }
      
      const now = Date.now();
      
      // Zamknij
      roundQueries.close.run(now, roundId);
      
      return {
        id: roundId,
        status: 'closed',
        closedAt: now
      };
      
    } catch (error) {
      console.error('[RoundService] Error closing round:', error);
      throw new Error(error.message || 'Nie udało się zamknąć rundy');
    }
  }
  
  /**
   * Sprawdź status rundy (dla workflow)
   */
  canAddComments(roundId) {
    try {
      const round = this.getRoundById(roundId);
      
      // Można komentować tylko w otwartej rundzie
      return round.status === 'open';
      
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Pobierz status rundy (open/frozen/closed)
   */
  getRoundStatus(roundId) {
    try {
      const round = this.getRoundById(roundId);
      return round.status;
    } catch (error) {
      return null;
    }
  }
}

// Singleton
export default new RoundService();