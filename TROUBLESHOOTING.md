# Troubleshooting Guide

## Error 1: 401 Unauthorized on Owner Login

### Problem
You're seeing `GET 401 - Unauthorized` when trying to login.

### Root Cause
**You need to REGISTER an owner account first!** The 401 error means:
- No owner account exists with those credentials
- The password is incorrect

### Solution
1. Go to: `http://localhost:3000`
2. Click "Register as Owner" (NOT Login)
3. Fill in the registration form:
   - Full Name: Your name
   - Email: your-email@example.com
   - Password: your-password
   - Team Name: Team Alpha
   - Team Code: TEAM001
   - Mobile Number: 9876543210
4. Click "Register"
5. You'll be automatically logged in and redirected to dashboard

**Note:** Owner login will fail until you've registered an account.

---

## Error 2: 404 Not Found on /api/owner/all-events

### Problem
You're seeing `GET 404 - Not Found` on the all-events endpoint.

### Root Cause
The backend server hasn't restarted after adding the new route. Node.js needs to restart to load the new code.

### Solution
**RESTART THE BACKEND SERVER:**

1. In your Backend terminal:
   - Press `Ctrl+C` to stop the server
   - Wait a few seconds
   - Run: `npm start`
   - Wait for: "Server running on port 5000"

2. Refresh the frontend:
   - Go back to browser
   - Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
   - The all-events endpoint will now work

### How to Restart Properly
```bash
# Terminal 1 (Backend)
cd Backend
Ctrl+C  (stop current server)
npm start  (restart)

# Terminal 2 (Frontend - no changes needed)
# Just refresh browser

# Terminal 3 (MongoDB - keep running)
# No restart needed
```

---

## Summary of Next Steps

1. ✅ **Backend:** `npm start` (restart if running)
2. ✅ **Frontend:** Refresh browser (`Ctrl+Shift+R`)
3. ✅ **Register:** Create an Owner account (don't login yet)
4. ✅ **Use Dashboard:** Add technocrats, assign events, etc.

---

## If Still Having Issues

### Check Backend Logs
- Look for "Server running on port 5000" message
- Look for "MongoDB connected" message
- If either is missing, you have a startup issue

### Verify Routes Are Registered
In backend terminal, the startup should show:
```
Server running on port 5000
MongoDB connected: localhost
```

### Test Health Endpoint
In browser: `http://localhost:5000/api/health`
Should return: `{"success": true, "message": "Server is running"}`

---
