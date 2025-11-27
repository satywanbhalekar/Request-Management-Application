# Request Management System API

A robust Express.js backend with Supabase PostgreSQL for managing employee requests with approval workflows.

## Features

- **JWT Authentication** with bcrypt password hashing
- **Role-Based Access Control** (Employee/Manager)
- **Request Workflow**: Create → Approve/Reject → Close
- **Audit Trail**: Complete action history for requests
- **Business Rules Enforcement**:
  - Employees create requests and assign to other employees
  - Only assigned employee's manager can approve/reject
  - Only assigned employee can close approved requests
- **Clean Architecture**: Repository → Service → Controller pattern
- **Error Handling**: Centralized error middleware
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Structured JSON logging

## Tech Stack

- Node.js + Express.js
- Supabase PostgreSQL
- JWT + bcrypt
- Joi validation
- Winston logging (structured)

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ installed
- Supabase account
- Git

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and service role key

### 3. Setup Database

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the SQL from `Database Schema` artifact
3. Execute the script to create tables

### 4. Install Dependencies

```bash
npm install
```

### 5. Environment Configuration

Create `.env` file in root directory:

```bash
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://mhaoksxiroflwuashsph.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYW9rc3hpcm9mbHd1YXNoc3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjM1MDEsImV4cCI6MjA3OTUzOTUwMX0.lsg74ICb7zfzqBxLw3Jg4cGfJO9HBuVxXuwPOMxSL1c

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 6. Run the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

```
src/
├── config/
│   ├── database.js          # Supabase client
│   └── logger.js            # Logging configuration
├── middleware/
│   ├── auth.js              # JWT & RBAC middleware
│   ├── validation.js        # Joi validation schemas
│   └── errorHandler.js      # Global error handler
├── repositories/
│   ├── employeeRepository.js
│   ├── requestRepository.js
│   └── actionRepository.js
├── services/
│   ├── authService.js       # Authentication logic
│   └── requestService.js    # Request workflow logic
├── controllers/
│   ├── authController.js
│   └── requestController.js
├── routes/
│   ├── authRoutes.js
│   └── requestRoutes.js
├── utils/
│   └── AppError.js          # Custom error class
├── app.js                   # Express app setup
└── server.js                # Server entry point
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication

#### Register Employee
```http
POST /auth/register
Content-Type: application/json

{
  "email": "employee@company.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "employee",
  "managerId": "uuid-of-manager" // optional
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "employee": {
      "id": "uuid",
      "email": "employee@company.com",
      "full_name": "John Doe",
      "role": "employee",
      "manager_id": "uuid-of-manager",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "employee@company.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "employee": { ... },
    "token": "jwt-token"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "employee": { ... }
  }
}
```

---

### 2. Requests

#### Create Request
```http
POST /requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Website Update Request",
  "description": "Update the homepage banner",
  "assignedTo": "uuid-of-employee"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "request": {
      "id": "uuid",
      "title": "Website Update Request",
      "description": "Update the homepage banner",
      "status": "pending",
      "created_by": "uuid",
      "assigned_to": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get All Requests
```http
GET /requests
GET /requests?status=pending
GET /requests?assignedTo=uuid
GET /requests?createdBy=uuid
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "title": "Request Title",
        "status": "pending",
        "creator": {
          "id": "uuid",
          "full_name": "John Doe",
          "email": "john@company.com"
        },
        "assignee": {
          "id": "uuid",
          "full_name": "Jane Smith",
          "email": "jane@company.com"
        }
      }
    ]
  }
}
```

#### Get Request by ID
```http
GET /requests/:id
Authorization: Bearer <token>
```

#### Approve Request (Manager Only)
```http
POST /requests/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Approved after review" // optional
}
```

**Business Rule:** Only the manager of the assigned employee can approve

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "request": {
      "id": "uuid",
      "status": "approved",
      "approved_by": "manager-uuid",
      ...
    }
  }
}
```

#### Reject Request (Manager Only)
```http
POST /requests/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Needs more details" // optional
}
```

**Business Rule:** Only the manager of the assigned employee can reject

#### Close Request
```http
POST /requests/:id/close
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Work completed" // optional
}
```

**Business Rules:**
- Only the assigned employee can close
- Request must be approved first

#### Get Request Action History
```http
GET /requests/:id/actions
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "actions": [
      {
        "id": "uuid",
        "action_type": "closed",
        "notes": "Work completed",
        "created_at": "2024-01-03T00:00:00.000Z",
        "performer": {
          "full_name": "Jane Smith"
        }
      },
      {
        "id": "uuid",
        "action_type": "approved",
        "notes": "Looks good",
        "created_at": "2024-01-02T00:00:00.000Z",
        "performer": {
          "full_name": "Manager Name"
        }
      },
      {
        "id": "uuid",
        "action_type": "created",
        "created_at": "2024-01-01T00:00:00.000Z",
        "performer": {
          "full_name": "John Doe"
        }
      }
    ]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Example Error:**
```json
{
  "status": "fail",
  "message": "Only the assigned employee's manager can approve this request"
}
```

---

## Business Rules

### Request Workflow

1. **Creation**: Any employee can create a request and assign it to another employee
2. **Approval/Rejection**: Only the assigned employee's manager can approve or reject
3. **Closing**: Only the assigned employee can close, and only after approval

### Status Flow

```
pending → approved → closed
       ↘ rejected
```

- `pending`: Initial state after creation
- `approved`: Manager approved the request
- `rejected`: Manager rejected the request
- `closed`: Assigned employee completed and closed

### Role-Based Access

- **Employee**: Create requests, close own assigned approved requests
- **Manager**: Approve/reject requests for their direct reports

---

## Testing the API

### Using curl

**1. Register a Manager:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@company.com",
    "password": "password123",
    "fullName": "Manager One",
    "role": "manager"
  }'
```

**2. Register an Employee:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123",
    "fullName": "Employee One",
    "role": "employee",
    "managerId": "<manager-id-from-step-1>"
  }'
```

**3. Login as Employee:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123"
  }'
```

**4. Create Request (use token from step 3):**
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer <employee-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Update homepage",
    "description": "Change banner image",
    "assignedTo": "<employee-id>"
  }'
```

**5. Login as Manager and Approve:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@company.com",
    "password": "password123"
  }'

# Approve request
curl -X POST http://localhost:5000/api/requests/<request-id>/approve \
  -H "Authorization: Bearer <manager-token>" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Approved"}'
```

### Using Postman/Insomnia

Import the endpoints from the API documentation above. Set up environment variables for tokens.

---

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Stateless token-based auth
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries via Supabase client

---

## Monitoring & Logging

All logs are structured JSON format:

```json
{
  "level": "info",
  "message": "Request created",
  "requestId": "uuid",
  "creatorId": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Log Levels:**
- `info`: Normal operations
- `warn`: Warning messages
- `error`: Error events with stack traces
- `debug`: Detailed debugging information

---




