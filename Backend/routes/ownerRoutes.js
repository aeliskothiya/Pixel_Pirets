import express from 'express';
import {
  registerOwner,
  loginOwner,
  getTeamProfile,
  editTeamDetails,
  addTechnocrat,
  editTechnocrat,
  deleteTechnocrat,
  assignEvents,
  removeEventAssignment,
  setIconPlayer,
  getTeamScores,
  getLeaderboard
} from '../controllers/ownerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Authentication
router.post('/register', registerOwner);
router.post('/login', loginOwner);

// Protected routes (Owner only)
router.get('/team-profile', protect, authorize('owner'), getTeamProfile);
router.put('/team-profile', protect, authorize('owner'), editTeamDetails);

// Technocrat Management
router.post('/technocrat', protect, authorize('owner'), addTechnocrat);
router.put('/technocrat/:technocratId', protect, authorize('owner'), editTechnocrat);
router.delete('/technocrat/:technocratId', protect, authorize('owner'), deleteTechnocrat);

// Event Assignment
router.post('/assign-events', protect, authorize('owner'), assignEvents);
router.delete('/remove-event/:technocratId/:eventId', protect, authorize('owner'), removeEventAssignment);

// Icon Player
router.post('/set-icon-player', protect, authorize('owner'), setIconPlayer);

// Scores & Leaderboard
router.get('/team-scores', protect, authorize('owner'), getTeamScores);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
