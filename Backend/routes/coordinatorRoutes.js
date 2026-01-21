import express from 'express';
import {
  registerCoordinator,
  loginCoordinator,
  getAllTeams,
  getAllTechnocrats,
  getParticipationDetails,
  createEvent,
  editEvent,
  deleteEvent,
  addResult,
  editResult,
  deleteResult,
  getFinalLeaderboard,
  getEventResultsSummary,
  getAllEvents
} from '../controllers/coordinatorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Authentication
router.post('/register', registerCoordinator);
router.post('/login', loginCoordinator);

// Protected routes (Coordinator only)

// View Data
router.get('/all-teams', protect, authorize('coordinator'), getAllTeams);
router.get('/all-technocrats', protect, authorize('coordinator'), getAllTechnocrats);
router.get('/participation-details', protect, authorize('coordinator'), getParticipationDetails);

// Event Management
router.get('/events', protect, authorize('coordinator'), getAllEvents);
router.post('/events', protect, authorize('coordinator'), createEvent);
router.put('/events/:eventId', protect, authorize('coordinator'), editEvent);
router.delete('/events/:eventId', protect, authorize('coordinator'), deleteEvent);

// Result Management
router.post('/results', protect, authorize('coordinator'), addResult);
router.put('/results/:resultId', protect, authorize('coordinator'), editResult);
router.delete('/results/:resultId', protect, authorize('coordinator'), deleteResult);

// Leaderboard & Summary
router.get('/leaderboard', protect, authorize('coordinator'), getFinalLeaderboard);
router.get('/results-summary', protect, authorize('coordinator'), getEventResultsSummary);

export default router;
