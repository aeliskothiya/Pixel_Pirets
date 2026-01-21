import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Owner API
export const ownerAPI = {
  register: (data) => api.post('/owner/register', data),
  login: (data) => api.post('/owner/login', data),
  getTeamProfile: () => api.get('/owner/team-profile'),
  editTeamDetails: (data) => api.put('/owner/team-profile', data),
  addTechnocrat: (data) => api.post('/owner/technocrat', data),
  editTechnocrat: (id, data) => api.put(`/owner/technocrat/${id}`, data),
  deleteTechnocrat: (id) => api.delete(`/owner/technocrat/${id}`),
  assignEvents: (data) => api.post('/owner/assign-events', data),
  removeEventAssignment: (technocratId, eventId) =>
    api.delete(`/owner/remove-event/${technocratId}/${eventId}`),
  setIconPlayer: (data) => api.post('/owner/set-icon-player', data),
  getTeamScores: () => api.get('/owner/team-scores'),
  getLeaderboard: () => api.get('/owner/leaderboard')
};

// Coordinator API
export const coordinatorAPI = {
  register: (data) => api.post('/coordinator/register', data),
  login: (data) => api.post('/coordinator/login', data),
  getAllTeams: () => api.get('/coordinator/all-teams'),
  getAllTechnocrats: () => api.get('/coordinator/all-technocrats'),
  getParticipationDetails: () => api.get('/coordinator/participation-details'),
  getAllEvents: () => api.get('/coordinator/events'),
  createEvent: (data) => api.post('/coordinator/events', data),
  editEvent: (id, data) => api.put(`/coordinator/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/coordinator/events/${id}`),
  addResult: (data) => api.post('/coordinator/results', data),
  editResult: (id, data) => api.put(`/coordinator/results/${id}`, data),
  deleteResult: (id) => api.delete(`/coordinator/results/${id}`),
  getFinalLeaderboard: (sortBy) =>
    api.get('/coordinator/leaderboard', { params: { sortBy } }),
  getEventResultsSummary: (eventId) =>
    api.get('/coordinator/results-summary', { params: { eventId } })
};

export default api;
