# Quick Start Guide - Pixel Pirates

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites Check
- Node.js installed? → `node --version`
- MongoDB running? → `mongod`
- npm available? → `npm --version`

### 2. Install Dependencies
```bash
# Root directory
npm install

# Frontend directory
cd Frontend
npm install
cd ..
```

### 3. Environment Setup
Create `.env` in root:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixel_pirates
JWT_SECRET=your_secret_key_123
NODE_ENV=development
```

### 4. Start the App

**Terminal 1 (Backend):**
```bash
npm run dev
# Server on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
# App on http://localhost:3000
```

## 🧪 Test Credentials

### Create Owner Account
1. Go to http://localhost:3000
2. Click "Register as Owner"
3. Fill details:
   - Name: John Doe
   - Email: owner@test.com
   - Password: password123
   - Team Name: Alpha Team
   - Team Code: TEAM001
   - Mobile: 9876543210

### Create Coordinator (Backend)
Use MongoDB Compass or create via API:
```bash
# POST http://localhost:5000/api/coordinator/register
{
  "name": "Admin Coordinator",
  "email": "coordinator@test.com",
  "password": "password123"
}
```

## 📋 Feature Checklist

### Owner Features
- [ ] Register and create team
- [ ] Add technocrats
- [ ] Assign events (1-3 per person)
- [ ] Set icon player
- [ ] View team scores
- [ ] Check leaderboard

### Coordinator Features
- [ ] Login to coordinator dashboard
- [ ] Create events
- [ ] Add results
- [ ] View all teams
- [ ] View leaderboard
- [ ] Manage technocrats

## 🔧 Common Issues

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod
# Windows: mongod --dbpath "C:\path\to\data"
```

### Port Already in Use
```bash
# Change PORT in .env (Backend)
# Change port in Frontend\vite.config.js
```

### CORS Error
Backend already configured for CORS. Ensure:
- Backend running on :5000
- Frontend proxy configured in vite.config.js

## 📚 API Testing

### Test Owner Registration
```bash
curl -X POST http://localhost:5000/api/owner/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Owner",
    "email": "test@example.com",
    "password": "pass123",
    "teamName": "Test Team",
    "teamCode": "TEST001",
    "ownerContact": "9876543210"
  }'
```

### Test Coordinator Login
```bash
curl -X POST http://localhost:5000/api/coordinator/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coordinator@test.com",
    "password": "password123"
  }'
```

## 🎯 Next Steps

1. ✅ Setup complete!
2. 📖 Read README.md for detailed documentation
3. 🧪 Test all features in dashboard
4. 🎨 Customize UI/styling as needed
5. 🚀 Deploy to production

## 📞 Help

Check Backend/server.js for CORS and route configurations
Check Frontend/.env setup for API endpoint configuration
