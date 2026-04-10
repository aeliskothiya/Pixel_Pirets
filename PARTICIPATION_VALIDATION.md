# Event Participation Validation System

## Overview
This document describes the comprehensive event participation validation system implemented for the Tech Fest Management System. The system ensures that when coordinators add event results, the exact number of required participants (based on event type) are included.

## Event Types & Requirements

### Solo Events
- **Required Members**: Exactly 1
- **Description**: Single participant event
- **Validation**: System enforces exactly 1 member during result submission

### Duet Events
- **Required Members**: Exactly 2
- **Description**: Two participant event
- **Validation**: System enforces exactly 2 members during result submission

### Group Events
- **Required Members**: 3 or more (coordinator specifies)
- **Description**: Multiple participant event
- **Validation**: System enforces minimum 3 members and coordinator-specified count during result submission

## Implementation Details

### Backend - Event Model (`Backend/models/Event.js`)

**New Field Added:**
```javascript
requiredMembers: {
  type: Number,
  required: [true, 'Please provide required members count'],
  min: 1,
  validate: {
    validator: function(value) {
      if (this.eventType === 'Solo') return value === 1;
      if (this.eventType === 'Duet') return value === 2;
      if (this.eventType === 'Group') return value >= 3;
      return false;
    },
    message: 'Invalid required members for this event type'
  }
}
```

**Validation Rules:**
- Solo events must have exactly 1 required member
- Duet events must have exactly 2 required members
- Group events must have 3 or more required members

### Backend - Event Creation (`coordinatorController.js - createEvent()`)

**Validations Implemented:**
1. Checks `requiredMembers` parameter is provided
2. Validates event type matches member count:
   - Solo: must be exactly 1
   - Duet: must be exactly 2
   - Group: must be 3 or more
3. Returns clear error messages for validation failures

**Error Responses:**
- 400 Bad Request with message indicating requirement mismatch

### Backend - Result Addition (`coordinatorController.js - addResult()`)

**Validations Implemented:**
1. **Technocrat Count Validation**
   - Checks `technocratIds` array exists and is not empty
   - Validates that number of selected technocrats equals `event.requiredMembers`

2. **Technocrat Existence Verification**
   - Confirms all selected technocrats exist in database
   - Fails if any technocrat ID is invalid

3. **Team Membership Verification**
   - Ensures all selected technocrats belong to the same team as the result's team
   - Prevents cross-team participation

**Error Responses:**
```javascript
// Insufficient members
400: "This event requires exactly 3 member(s). You provided 2."

// Technocrats not found
404: "Some technocrats not found"

// Technocrats from different teams
400: "All technocrats must belong to the same team"

// Position already has result
400: "Result for this team and position already exists"
```

## Frontend Implementation

### Coordinator Dashboard (`Frontend/src/pages/CoordinatorDashboard.jsx`)

#### Create Event Modal Updates

**Auto-fill Logic:**
- When coordinator selects event type, `requiredMembers` is auto-filled:
  - Solo → 1 (disabled input)
  - Duet → 2 (disabled input)
  - Group → empty (user must enter, min 3)

**Form Validation:**
```javascript
validator: (_, value) => {
  if (!selectedEventType) return Promise.resolve();
  if (selectedEventType === 'Solo' && value !== 1)
    return Promise.reject('Solo event must have exactly 1 member');
  if (selectedEventType === 'Duet' && value !== 2)
    return Promise.reject('Duet event must have exactly 2 members');
  if (selectedEventType === 'Group' && value < 3)
    return Promise.reject('Group event must have at least 3 members');
  return Promise.resolve();
}
```

#### Add Result Modal Updates

**Event Selection:**
- Shows event name, type, and required member count
- Example: "Event X (Group) - Requires 3 member(s)"

**Technocrat Selection:**
- Multi-select dropdown
- Dynamic label showing required count: "Technocrats (Select exactly 3)"
- Form validation ensures selected count matches requirement

**Form Validation:**
```javascript
validator: (_, value) => {
  if (!selectedEventForResult) return Promise.resolve();
  if (!value || value.length !== selectedEventForResult.requiredMembers)
    return Promise.reject(`Please select exactly ${selectedEventForResult.requiredMembers} member(s)`);
  return Promise.resolve();
}
```

## User Workflow

### For Coordinators Creating Events

1. Open "Create Event" modal
2. Enter event name
3. Select event type (Solo/Duet/Group)
4. Enter required members (auto-filled for Solo/Duet, required input for Group)
5. Enter points for each position
6. System validates before submission

### For Coordinators Adding Results

1. Open "Add Result" modal
2. Select event (shows required member count)
3. Select team
4. Select exact number of technocrats matching requirement
5. Select position (1st/2nd/3rd)
6. System validates all requirements before submission

## Data Flow

```
Coordinator Input → Frontend Validation → API Call → Backend Validation → Database
                                                ↓
                                    Clear Error Message
                                    (if validation fails)
```

## Error Handling

**Frontend Errors:**
- Form validation prevents invalid submissions
- Real-time feedback to coordinator
- Clear messages indicating exact requirements

**Backend Errors:**
- Double-checks all validations
- Provides specific error messages
- Prevents invalid data entry into database

## Testing Checklist

- [ ] Create Solo event, verify requiredMembers = 1
- [ ] Create Duet event, verify requiredMembers = 2
- [ ] Create Group event with 3 members
- [ ] Create Group event with 5 members
- [ ] Try to add result with wrong number of technocrats (should fail)
- [ ] Try to add result with correct number from different teams (should fail)
- [ ] Add result with correct number from same team (should succeed)
- [ ] Verify error messages are clear and helpful

## API Endpoints

### Create Event
**POST** `/api/coordinator/events`
```json
{
  "eventName": "String",
  "eventType": "Solo|Duet|Group",
  "requiredMembers": 1|2|3+,
  "points": {
    "first": Number,
    "second": Number,
    "third": Number
  }
}
```

### Add Result
**POST** `/api/coordinator/results`
```json
{
  "eventId": "ObjectId",
  "teamId": "ObjectId",
  "position": "1st|2nd|3rd",
  "technocratIds": ["ObjectId", "ObjectId", ...]
}
```

## Benefits

1. **Data Integrity**: Ensures valid participation data in database
2. **User Guidance**: Clear feedback helps coordinators understand requirements
3. **Error Prevention**: Catches mistakes before saving
4. **Audit Trail**: System has validation proof
5. **Fair Results**: Prevents incorrect result entry that would skew rankings

## Future Enhancements

1. Bulk result import with validation
2. Result editing with participation updates
3. Team substitution rules
4. Late participation addition
5. Disqualification handling
