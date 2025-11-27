/**
 * ===================================
 * ARTHEA - ROUNDS CONTROLLER
 * ===================================
 * PLIK: modules/communication/controllers/roundsController.js
 * 
 * CO ROBI:
 * - Obsługuje HTTP requesty dla rund
 */

import roundService from '../services/roundService.js';

class RoundsController {
  
  /**
   * POST /api/communication/rounds
   * Utwórz nową rundę
   */
  async createRound(req, res) {
    try {
      const { shotId } = req.body;
      
      const round = roundService.createRound(shotId);
      
      res.status(201).json({
        success: true,
        data: round,
        message: `Utworzono rundę ${round.roundNumber}`
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/rounds/:id
   * Pobierz rundę po ID
   */
  async getRoundById(req, res) {
    try {
      const { id } = req.params;
      
      const round = roundService.getRoundById(id);
      
      res.json({
        success: true,
        data: round
      });
      
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/rounds/shot/:shotId/active
   * Pobierz aktywną rundę dla ujęcia
   */
  async getActiveRound(req, res) {
    try {
      const { shotId } = req.params;
      
      const round = roundService.getActiveRoundByShotId(shotId);
      
      if (!round) {
        return res.json({
          success: true,
          data: null,
          message: 'Brak aktywnej rundy'
        });
      }
      
      res.json({
        success: true,
        data: round
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * PATCH /api/communication/rounds/:id/freeze
   * Zamroź rundę (wstrzymaj komentowanie)
   */
  async freezeRound(req, res) {
    try {
      const { id } = req.params;
      
      const result = roundService.freezeRound(id);
      
      res.json({
        success: true,
        data: result,
        message: 'Runda zamrożona - komentowanie wstrzymane'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * PATCH /api/communication/rounds/:id/close
   * Zamknij rundę (finalizacja)
   */
  async closeRound(req, res) {
    try {
      const { id } = req.params;
      
      const result = roundService.closeRound(id);
      
      res.json({
        success: true,
        data: result,
        message: 'Runda zamknięta'
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/communication/rounds/:id/status
   * Pobierz status rundy
   */
  async getRoundStatus(req, res) {
    try {
      const { id } = req.params;
      
      const status = roundService.getRoundStatus(id);
      
      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Nie znaleziono rundy'
        });
      }
      
      res.json({
        success: true,
        data: { status }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new RoundsController();