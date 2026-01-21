"# Pixel Pirates - Tech Fest Management System

A comprehensive web application for managing tech fest events, participants, and leaderboards with role-based access control for Team Owners and Tech Coordinators.

## 🎯 Features

### Owner Module
- ✅ Team management (Create, Edit, View)
- ✅ Technocrat management (Add, Edit, Delete)
- ✅ Event assignment (Min 1 - Max 3 events per technocrat)
- ✅ Icon Player selection (1 per team)
- ✅ Score viewing (Event-wise and Total)
- ✅ Leaderboard viewing (Read-only)
- ❌ Cannot create events, add results, or assign points

### Coordinator Module
- ✅ View all teams and participants
- ✅ Event management (Create, Edit, Delete)
- ✅ Result management (Add, Edit, Delete)
- ✅ Auto-calculation of points
- ✅ Final leaderboard generation
- ✅ Participation details

### System Features
- ✅ Role-based authentication & authorization
- ✅ JWT token-based security
- ✅ Unique enrollment number validation
- ✅ Auto-leaderboard ranking
- ✅ Auto-score calculation
- ✅ Session handling

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Ant Design** for UI components
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd Pixel_Pirates
```

### 2. Install dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd Frontend
npm install
```

### 3. Setup Environment Variables

Create `.env` file in root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixel_pirates
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Start MongoDB
```bash
mongod
```

## 🚀 Running the Application

### Start Backend
```bash
npm start
# or for development with auto-reload
npm run dev
```
Backend runs on `http://localhost:5000`

### Start Frontend
```bash
cd Frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## 📊 API Endpoints

### Owner Routes (`/api/owner`)

**Authentication:**
- `POST /register` - Register new owner with team
- `POST /login` - Owner login

**Team Management:**
- `GET /team-profile` - Get team details
- `PUT /team-profile` - Update team details

**Technocrat Management:**
- `POST /technocrat` - Add technocrat
- `PUT /technocrat/:id` - Edit technocrat
- `DELETE /technocrat/:id` - Delete technocrat

**Event Management:**
- `POST /assign-events` - Assign events to technocrat
- `DELETE /remove-event/:technocratId/:eventId` - Remove event

**Icon Player:**
- `POST /set-icon-player` - Set icon player

**Scoring:**
- `GET /team-scores` - Get event-wise and total scores
- `GET /leaderboard` - Get leaderboard

### Coordinator Routes (`/api/coordinator`)

**Authentication:**
- `POST /register` - Register coordinator
- `POST /login` - Coordinator login

**View Data:**
- `GET /all-teams` - Get all teams
- `GET /all-technocrats` - Get all technocrats
- `GET /participation-details` - Get participation summary

**Event Management:**
- `GET /events` - Get all events
- `POST /events` - Create event
- `PUT /events/:id` - Edit event
- `DELETE /events/:id` - Delete event

**Result Management:**
- `POST /results` - Add result (auto-calculates points)
- `PUT /results/:id` - Edit result
- `DELETE /results/:id` - Delete result

**Leaderboard:**
- `GET /leaderboard` - Get final leaderboard (sortable)
- `GET /results-summary` - Get results summary

## 📁 Project Structure

```
Pixel_Pirates/
├── Backend/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── ownerController.js
│   │   └── coordinatorController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Owner.js
│   │   ├── Coordinator.js
│   │   ├── Team.js
│   │   ├── Technocrat.js
│   │   ├── Event.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── ownerRoutes.js
│   │   └── coordinatorRoutes.js
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── OwnerRegister.jsx
│   │   │   ├── OwnerLogin.jsx
│   │   │   ├── CoordinatorLogin.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── CoordinatorDashboard.jsx
│   │   │   └── Auth.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── Dashboard.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Security Features

- **Password Hashing:** Using bcryptjs with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **Role-Based Access:** Different permissions for Owner and Coordinator
- **Session Management:** Token validation on each request
- **Data Validation:** Joi schema validation for inputs

## 🎮 Usage Guide

### For Team Owner

1. **Register:** Create team account with team details
2. **Add Members:** Add technocrats to team
3. **Assign Events:** Assign 1-3 events to each member
4. **Set Icon Player:** Select one member as icon player
5. **Monitor Scores:** Track event-wise and total scores
6. **View Leaderboard:** See team ranking

### For Tech Coordinator

1. **Login:** Access coordinator dashboard
2. **Create Events:** Set up events with point structure
3. **Add Results:** Record event results and positions
4. **Auto Scoring:** Points automatically calculated
5. **Manage Data:** Edit or delete events/results as needed
6. **Generate Leaderboard:** View final rankings

## 📝 Database Models

### Owner
- name, email, password, role, team reference

### Coordinator
- name, email, password, role

### Team
- teamName, teamCode, owner, iconPlayer, totalScore, rank

### Technocrat
- name, enrollmentNumber (unique), semester, mobileNumber, team, assignedEvents, isIconPlayer

### Event
- eventName, eventType (Solo/Duet/Group), points (1st/2nd/3rd)

### Result
- event, team, position (1st/2nd/3rd), pointsAwarded, technocrats

## 🔄 Validation Rules

- ✅ Unique enrollment number per technocrat
- ✅ Only 1 owner per team
- ✅ Only 1 icon player per team
- ✅ 1-3 events per technocrat
- ✅ 10-digit mobile number
- ✅ Valid email format
- ✅ Unique position per event-team combination

## 🎨 UI Features

- Responsive design with Ant Design components
- Clean and intuitive dashboards
- Real-time data updates
- Modal forms for data entry
- Table views for data management
- Statistics cards for quick overview

## 🚀 Future Enhancements

- [ ] Export leaderboard to PDF/Excel
- [ ] Live score update notifications
- [ ] Event participation charts
- [ ] Advanced search and filter
- [ ] Team comparison view
- [ ] Email notifications
- [ ] Mobile app version

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

This project is licensed under ISC License." 
