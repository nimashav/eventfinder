# EventFinder API Documentation

## 🚀 Server Information
- **Base URL**: `http://localhost:5001/api`
- **Health Check**: `http://localhost:5001/api/health`
- **Database**: MongoDB (localhost:27017/eventfinder)

## 📋 Event Endpoints

### GET /events
Fetch all events with optional filtering
- **Query Parameters**:
  - `status`: Filter by event status (`pending`, `approved`, `rejected`)
  - `category`: Filter by category
- **Response**: 
  ```json
  {
    "success": true,
    "count": 1,
    "data": [...]
  }
  ```

### POST /events
Create a new event (automatically set to pending status)
- **Body**:
  ```json
  {
    "eventName": "Event Name",
    "description": "Event description",
    "address": "Event location",
    "date": "2024-12-25",
    "time": "15:00",
    "category": "tech-innovation",
    "organizer": {
      "name": "Organizer Name",
      "email": "email@example.com",
      "phone": "+1234567890"
    },
    "image": "filename.jpg" // optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Event submitted successfully! It will be reviewed by admin.",
    "data": { ... }
  }
  ```

### PUT /events/:id/status
Update event status (admin only)
- **Body**:
  ```json
  {
    "status": "approved|rejected|pending",
    "reviewedBy": "Admin Name",
    "rejectionReason": "Reason for rejection" // optional, for rejected events
  }
  ```

### GET /events/:id
Get single event by ID

### DELETE /events/:id
Delete event by ID

### GET /events/admin/stats
Get event statistics for admin dashboard
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "pending": 5,
      "approved": 10,
      "rejected": 2,
      "total": 17
    }
  }
  ```

## 📊 Event Status Workflow
1. **User submits event** → Status: `pending`
2. **Admin reviews** → Status: `approved` or `rejected`
3. **Approved events** → Visible to public
4. **Rejected events** → Include rejection reason

## 🔧 Testing Commands (PowerShell)

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:5001/api/health

# Create event
Invoke-RestMethod -Uri http://localhost:5001/api/events -Method POST -ContentType "application/json" -Body '{"eventName":"Test Event","description":"Test description","address":"Test Location","date":"2024-12-25","time":"15:00","category":"tech-innovation"}'

# Get all events
Invoke-RestMethod -Uri http://localhost:5001/api/events

# Get pending events
Invoke-RestMethod -Uri "http://localhost:5001/api/events?status=pending"

# Approve event (replace ID)
Invoke-RestMethod -Uri http://localhost:5001/api/events/EVENT_ID/status -Method PUT -ContentType "application/json" -Body '{"status":"approved","reviewedBy":"Admin"}'
```

## 🌐 Frontend Integration
- **Client URL**: `http://localhost:3000`
- **Form Endpoint**: `/add-event` page
- **Backend Connection**: Configured to use `http://localhost:5001/api/events`
