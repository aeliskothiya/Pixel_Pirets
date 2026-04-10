# Event Participation Validation - Quick Testing Guide

## Prerequisites
- Backend server running on port 5000
- Frontend running on Vite dev server
- MongoDB connection active
- Coordinator account created and logged in

## Test Scenario 1: Create Solo Event

**Steps:**
1. Click "Create Event" button in Coordinator Dashboard
2. Enter Event Name: "Solo Coding Challenge"
3. Select Event Type: "Solo"
4. Observe: Required Members auto-fills to "1" and becomes disabled
5. Enter Points: 1st=100, 2nd=50, 3rd=25
6. Click "Create Event"

**Expected Result:**
- Event created successfully
- Solo event has requiredMembers=1
- Can proceed to add results

---

## Test Scenario 2: Create Duet Event

**Steps:**
1. Click "Create Event" button
2. Enter Event Name: "Duet Programming"
3. Select Event Type: "Duet"
4. Observe: Required Members auto-fills to "2" and becomes disabled
5. Enter Points: 1st=100, 2nd=50, 3rd=25
6. Click "Create Event"

**Expected Result:**
- Event created successfully
- Duet event has requiredMembers=2

---

## Test Scenario 3: Create Group Event

**Steps:**
1. Click "Create Event" button
2. Enter Event Name: "Group Project"
3. Select Event Type: "Group"
4. Observe: Required Members input field is enabled and empty
5. Enter Required Members: "4"
6. Enter Points: 1st=100, 2nd=50, 3rd=25
7. Click "Create Event"

**Expected Result:**
- Event created successfully
- Group event has requiredMembers=4

---

## Test Scenario 4: Test Invalid Group Member Count

**Steps:**
1. Click "Create Event" button
2. Enter Event Name: "Invalid Group"
3. Select Event Type: "Group"
4. Enter Required Members: "2" (invalid - should be 3+)
5. Attempt to submit

**Expected Result:**
- Form validation error: "Group event must have at least 3 members"
- Form does not submit

---

## Test Scenario 5: Add Result with Correct Participation

**Steps:**
1. Click "Add Result" button
2. Select Event: "Solo Coding Challenge (Solo) - Requires 1 member(s)"
3. Select Team: Any team
4. Observe: Technocrats label shows "Technocrats (Select exactly 1)"
5. Select 1 technocrat from dropdown
6. Select Position: "1st"
7. Click "Add Result"

**Expected Result:**
- Result added successfully
- Team score updated
- No validation errors

---

## Test Scenario 6: Add Result with Wrong Number of Participants (Too Few)

**Steps:**
1. Click "Add Result" button
2. Select Event: "Duet Programming (Duet) - Requires 2 member(s)"
3. Select Team: Any team
4. Observe: Technocrats label shows "Technocrats (Select exactly 2)"
5. Select only 1 technocrat
6. Attempt to submit

**Expected Result:**
- Form validation error: "Please select exactly 2 member(s)"
- Result not created
- Clear error message helps coordinator correct the issue

---

## Test Scenario 7: Add Result with Wrong Number of Participants (Too Many)

**Steps:**
1. Click "Add Result" button
2. Select Event: "Group Project (Group) - Requires 4 member(s)"
3. Select Team: Any team
4. Select 5 technocrats (more than required)
5. Attempt to submit

**Expected Result:**
- Form validation error: "Please select exactly 4 member(s)"
- Result not created

---

## Test Scenario 8: Add Result with Technocrats from Different Teams

**Steps:**
1. Click "Add Result" button
2. Select Event: "Solo Coding Challenge"
3. Select Team: "Team A"
4. Select Technocrats: Mix technocrats from Team B
5. Attempt to submit

**Expected Result:**
- Backend validation catches this
- Error message: "All technocrats must belong to the same team"

---

## Test Scenario 9: Verify Leaderboard Updates

**Steps:**
1. Add multiple results for different teams
2. Note team scores in Events tab
3. Check Leaderboard tab
4. Compare results

**Expected Result:**
- Leaderboard reflects all added results
- Team scores updated correctly
- Points awarded match event configuration

---

## Browser Console Checks

After each operation, check browser console (F12) for:
- ✅ No JavaScript errors
- ✅ API requests successful (200/201 status)
- ✅ Form validation working
- ✅ State updates logging correctly

---

## Backend Validation Testing (Advanced)

### Using Postman/cURL to test backend directly:

**Create Event:**
```bash
POST http://localhost:5000/api/coordinator/events
Content-Type: application/json
Authorization: Bearer <token>

{
  "eventName": "Test Event",
  "eventType": "Group",
  "requiredMembers": 3,
  "points": {
    "first": 100,
    "second": 50,
    "third": 25
  }
}
```

**Add Result:**
```bash
POST http://localhost:5000/api/coordinator/results
Content-Type: application/json
Authorization: Bearer <token>

{
  "eventId": "<event_id>",
  "teamId": "<team_id>",
  "position": "1st",
  "technocratIds": ["<tech_id_1>", "<tech_id_2>", "<tech_id_3>"]
}
```

**Test with wrong number:**
```bash
{
  "eventId": "<event_id>",
  "teamId": "<team_id>",
  "position": "1st",
  "technocratIds": ["<tech_id_1>", "<tech_id_2>"]  # Wrong count for Group
}
```

**Expected Backend Response:**
```json
{
  "success": false,
  "message": "This event requires exactly 3 member(s). You provided 2."
}
```

---

## Validation Checklist

- [ ] Solo event validation works (requiredMembers=1)
- [ ] Duet event validation works (requiredMembers=2)
- [ ] Group event validation works (requiredMembers>=3)
- [ ] Frontend prevents invalid submissions
- [ ] Backend prevents invalid data entry
- [ ] Error messages are clear and helpful
- [ ] Technocrat selection enforces count requirements
- [ ] Team membership validation works
- [ ] Leaderboard updates correctly
- [ ] No JavaScript errors in console

---

## Troubleshooting

**Issue: "requiredMembers is undefined"**
- Ensure backend Event model includes requiredMembers field
- Restart backend server
- Clear browser cache

**Issue: "Form won't submit"**
- Check browser console for validation errors
- Verify all required fields filled
- Ensure form values match backend expectations

**Issue: "Technocrat selection not updating"**
- Check that events array has requiredMembers property
- Verify selectedEventForResult state is updating
- Check browser console for React warnings

**Issue: "Result not created"**
- Check all technocrats belong to same team
- Verify technocrat count matches event requirement
- Check MongoDB connection is active
- Look at backend server logs for errors
