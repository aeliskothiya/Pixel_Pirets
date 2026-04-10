# ⚠️ MONGODB REQUIRED - TROUBLESHOOTING GUIDE

## The 500 Error You're Getting

The backend is running but **MongoDB is NOT connected**. This is why you see:
```
POST http://localhost:5000/api/owner/register 500 (Internal Server Error)
```

## ✅ SOLUTION - Start MongoDB

### Option 1: Local MongoDB (Recommended for Development)

**Windows - Install MongoDB Community:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. In Command Prompt, start MongoDB:
```cmd
mongod
```

You should see:
```
[initandlisten] waiting for connections on port 27017
```

### Option 2: MongoDB Atlas (Cloud - No Installation)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/pixel_pirates`)
5. Update `.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pixel_pirates
```

### Option 3: Docker (If Installed)

```cmd
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🧪 TEST YOUR DATABASE CONNECTION

Run this command to test:
```cmd
cd "c:\Users\Aelis Kothiya\OneDrive\Desktop\Pixel_Pirets"
node Backend/test-db.js
```

**Expected Output:**
```
Attempting to connect to MongoDB at: mongodb://localhost:27017/pixel_pirates
✅ MongoDB Connected Successfully!
Database: pixel_pirates
```

**If You Get Error:**
```
❌ MongoDB Connection Failed!
Error: connect ECONNREFUSED 127.0.0.1:27017
```

→ MongoDB is NOT running. Start it first (see Option 1 above)

---

## 🚀 NOW START YOUR APP

### Terminal 1 - Start MongoDB (Keep Running)
```cmd
mongod
```

### Terminal 2 - Start Backend
```cmd
cd "c:\Users\Aelis Kothiya\OneDrive\Desktop\Pixel_Pirets"
npm run dev
```

### Terminal 3 - Start Frontend
```cmd
cd "c:\Users\Aelis Kothiya\OneDrive\Desktop\Pixel_Pirets\Frontend"
npm run dev
```

---

## ✅ VERIFY EVERYTHING IS WORKING

1. **Backend Health Check:**
   - Open browser: http://localhost:5000/api/health
   - Should see: `{"success": true, "message": "Server is running"}`

2. **Frontend Running:**
   - Open browser: http://localhost:3000
   - Should see: Login page

3. **Try Register:**
   - Go to: http://localhost:3000/owner/register
   - Fill form and submit
   - Should work now!

---

## 📋 QUICK CHECKLIST

- [ ] MongoDB is installed (Option 1) OR MongoDB Atlas account created (Option 2)
- [ ] MongoDB is running (`mongod` command in terminal)
- [ ] `.env` file has correct MONGO_URI
- [ ] Backend is running (`npm run dev`)
- [ ] Frontend is running (`npm run dev` in Frontend folder)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health

---

## 🆘 STILL NOT WORKING?

1. **Check backend logs:** Look at the terminal where backend is running
2. **Restart everything:**
   ```cmd
   # Stop all terminals (Ctrl+C)
   # Kill mongod if running
   # Restart in order: MongoDB → Backend → Frontend
   ```
3. **Clear browser cache:** Press Ctrl+Shift+Delete in browser
4. **Check port conflicts:** 
   - Backend needs port 5000
   - Frontend needs port 3000
   - MongoDB needs port 27017

---

**Once MongoDB is running, the app will work perfectly!** 🎉
