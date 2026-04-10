# 🚀 SETUP GUIDE - Pixel Pirates Tech Fest Management

## Step-by-Step Installation

### STEP 1: Clone & Navigate
```bash
cd c:\Users\Aelis Kothiya\OneDrive\Desktop\Pixel_Pirets
```

### STEP 2: Install Root Dependencies
```bash
npm install
```

This installs:
- express, mongoose, cors, morgan
- bcryptjs, jsonwebtoken, joi
- react, react-dom, react-router-dom, axios, antd

### STEP 3: Install Frontend Dependencies
```bash
cd Frontend
npm install
cd ..
```

### STEP 4: Configure Environment
Create `.env` file in root directory with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixel_pirates
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
```

### STEP 5: Ensure MongoDB is Running
```bash
# Windows
mongod --dbpath "C:\path\to\data"

# Or if using MongoDB Atlas, update MONGO_URI in .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pixel_pirates
```

### STEP 6: Seed Coordinator (REQUIRED - Do This First!)
```bash
npm run seed
# Creates default coordinator with:
# Email: admin@pixelpirates.com
# Password: admin@123
```

This must be done BEFORE starting the app for the first time!

---

## 🎯 RUNNING THE APPLICATION

### IMPORTANT: Seed Coordinator First!
Before starting, you MUST create the coordinator account:
```bash
npm run seed
```

### Option A: Manual Start (3 Terminals - CORRECT ORDER)

**Terminal 1 - MongoDB (Start First):**
```bash
mongod
# Should show: waiting for connections on port 27017
```

**Terminal 2 - Backend:**
```bash
npm run dev
# Starts on http://localhost:5000
# You'll see: "Server running on port 5000"
```

**Terminal 3 - Frontend:**
```bash
cd Frontend
npm run dev
# Starts on http://localhost:3000
# You'll see: "Local: http://localhost:3000"
```

### Option B: Production Start
**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

---

## 🎮 FIRST TIME USAGE

### SETUP ORDER (DO IN THIS ORDER):

1. **Make sure MongoDB is running:**
   ```bash
   mongod
   ```

2. **Seed the coordinator account:**
   ```bash
   npm run seed
   # Output should show: ✅ Coordinator created successfully!
   ```

3. **Start backend:**
   ```bash
   npm run dev
   ```

4. **Start frontend (in new terminal):**
   ```bash
   cd Frontend
   npm run dev
   ```

### NOW USE THE APP:

#### Option A: Owner Registration (New Team)
- Go to http://localhost:3000
- Click "Register as Owner"
- Fill in:
  - Full Name: Your Name
  - Email: yourname@email.com
  - Password: password123
  - Team Name: Your Team
  - Team Code: TEAM001
  - Mobile: 9876543210
- Click Register → Auto-redirects to Owner Dashboard ✅

#### Option B: Coordinator Login (Pre-created)
- Navigate to http://localhost:3000/coordinator/login
- Use credentials:
  - Email: admin@pixelpirates.com
  - Password: admin@123
- Click Login → Redirects to Coordinator Dashboard ✅

---

## ✅ VERIFY SETUP

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Response: {"success": true, "message": "Server is running"}
```

### Test Owner Registration
```bash
curl -X POST http://localhost:5000/api/owner/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Owner",
    "email": "test@email.com",
    "password": "password123",
    "teamName": "Test Team",
    "teamCode": "TEST001",
    "ownerContact": "9876543210"
  }'
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Backend port 5000 in use?
# Edit .env and change: PORT=3001

# Frontend port 3000 in use?
# Edit Frontend/vite.config.js line 5: port: 3001,
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 mongo
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:** Ensure backend is running and CORS is configured (already done)

### Dependencies Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Connection Issues
- Verify backend running on :5000
- Verify frontend running on :3000
- Check firewall settings

---

## 📊 PROJECT FILE STRUCTURE

```
✅ Backend/
   ├── models/
   │  ├── Owner.js (✅ Password hashing)
   │  ├── Coordinator.js (✅ Role-based)
   │  ├── Team.js (✅ Auto scoring)
   │  ├── Technocrat.js (✅ Event validation)
   │  ├── Event.js (✅ Point structure)
   │  └── Result.js (✅ Auto-calculation)
   ├── controllers/
   │  ├── ownerController.js (✅ 11 functions)
   │  └── coordinatorController.js (✅ 13 functions)
   ├── routes/
   │  ├── ownerRoutes.js (✅ 12 endpoints)
   │  └── coordinatorRoutes.js (✅ 14 endpoints)
   ├── middleware/
   │  └── auth.js (✅ JWT + Role protection)
   ├── config/
   │  ├── database.js (✅ MongoDB connection)
   │  └── jwt.js (✅ Token generation)
   ├── server.js (✅ Main Express app)
   └── seed.js (✅ Coordinator seeding)

✅ Frontend/
   ├── src/
   │  ├── pages/
   │  │  ├── OwnerRegister.jsx (✅ Registration form)
   │  │  ├── OwnerLogin.jsx (✅ Owner login)
   │  │  ├── CoordinatorLogin.jsx (✅ Coordinator login)
   │  │  ├── OwnerDashboard.jsx (✅ Owner dashboard)
   │  │  ├── CoordinatorDashboard.jsx (✅ Coordinator dashboard)
   │  │  └── Auth.css (✅ Authentication styling)
   │  ├── components/
   │  │  └── PrivateRoute.jsx (✅ Route protection)
   │  ├── context/
   │  │  └── AuthContext.js (✅ Auth state management)
   │  ├── services/
   │  │  └── api.js (✅ API calls)
   │  ├── styles/
   │  │  └── Dashboard.css (✅ Dashboard styling)
   │  ├── App.jsx (✅ Main routing)
   │  ├── App.css
   │  ├── index.jsx (✅ Entry point)
   │  └── index.css
   ├── index.html (✅ HTML template)
   ├── vite.config.js (✅ Vite config + proxy)
   └── package.json (✅ Dependencies)

✅ Root Files
   ├── .env (✅ Environment variables)
   ├── .gitignore (✅ Git ignore)
   ├── package.json (✅ Root dependencies + scripts)
   ├── README.md (✅ Full documentation)
   ├── QUICKSTART.md (✅ Quick setup)
   ├── IMPLEMENTATION_SUMMARY.md (✅ Feature checklist)
   └── SETUP.md (✅ This file)
```

---

## 🎯 FEATURES READY TO USE

### Owner Can:
✅ Register with team
✅ Add team members (technocrats)
✅ Assign events (1-3 per person)
✅ Set icon player
✅ View team scores
✅ See leaderboard
✅ Edit team details
✅ Manage technocrats

### Coordinator Can:
✅ Login (credentials provided)
✅ Create events
✅ Add results
✅ View all teams
✅ View all technocrats
✅ Generate leaderboard
✅ View participation stats
✅ Delete events/results

---

## 💾 DATABASE

Your MongoDB `pixel_pirates` database will have:
- **Owner** collection (team owners)
- **Team** collection (team info)
- **Technocrat** collection (participants)
- **Event** collection (event definitions)
- **Result** collection (event results)
- **Coordinator** collection (coordinators)

---

## 🔐 SECURITY NOTES

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens expire in 30 days
- ✅ Role-based access control
- ✅ CORS configured
- ✅ Change JWT_SECRET in production
- ✅ Use environment variables for sensitive data

---

## 📞 QUICK COMMANDS

```bash
# Start development
npm run dev & cd Frontend && npm run dev

# Start production
npm start & cd Frontend && npm run build

# Create coordinator user
npm run seed

# Install dependencies
npm install && cd Frontend && npm install

# View logs
npm run dev 2>&1 | tee server.log
```

---

## ✨ NEXT STEPS

1. ✅ Follow the setup steps above
2. ✅ Create an owner account
3. ✅ Create a coordinator account (or use seeded one)
4. ✅ Test all features
5. ✅ Customize as needed
6. ✅ Deploy to production

---

## 🎉 YOU'RE READY TO GO!

Your Pixel Pirates Tech Fest Management System is fully set up and ready to use!

For detailed feature documentation, see **README.md**
For quick reference, see **QUICKSTART.md**
For implementation details, see **IMPLEMENTATION_SUMMARY.md**

Happy coding! 🚀
