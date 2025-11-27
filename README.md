# Request Management API

A Node.js/Express backend API for managing employee requests with role-based access control and Supabase integration.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Support for employee and manager roles
- **Request Workflow**: Create, approve, reject, and close requests
- **Action Tracking**: Automatic logging of all request actions
- **Error Handling**: Comprehensive error handling with custom error classes
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Structured JSON logging for all operations

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Start the server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new employee
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user (requires auth)

### Requests
- `POST /api/requests` - Create a new request
- `GET /api/requests` - Get all requests (with filtering)
- `GET /api/requests/:id` - Get request by ID
- `GET /api/requests/:id/actions` - Get request action history
- `POST /api/requests/:id/approve` - Approve request (manager only)
- `POST /api/requests/:id/reject` - Reject request (manager only)
- `POST /api/requests/:id/close` - Close request (assigned employee only)

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
