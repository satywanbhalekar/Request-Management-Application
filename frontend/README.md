# Request Management System - Frontend

A modern React/JSX frontend application for managing employee requests with JWT authentication and approval workflows.

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Role-Based Access**: Different capabilities for employees and managers
- **Request Management**: Create, view, and manage requests with real-time updates
- **Approval Workflow**: Complete request lifecycle (pending → approved/rejected → closed)
- **Audit Trail**: Full history of all actions and status changes on requests
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Toast notifications for all user actions

## Tech Stack

- **React 18.3** - UI library
- **Vite** - Build tool and bundler
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **CSS3** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Express backend running on `http://localhost:5000`
- npm or yarn package manager

### Installation

1. Navigate to frontend directory and install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

2. Create a `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update `.env` with your backend URL (default is already set):
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

### Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

### Build for Production

Create a production build:
\`\`\`bash
npm run build
npm run preview  # Preview the build locally
\`\`\`

## Project Structure

\`\`\`
frontend/src/
├── api/
│   └── client.js                # Axios API client with JWT interceptors
├── components/
│   ├── ProtectedRoute.jsx       # Route protection wrapper (auth check)
│   ├── DashboardHeader.jsx      # Header with user info and logout
│   ├── RequestsList.jsx         # Grid of request cards
│   ├── RequestCard.jsx          # Individual request card with actions
│   └── CreateRequestModal.jsx   # Modal for creating new requests
├── pages/
│   ├── LoginPage.jsx            # Login authentication page
│   ├── SignupPage.jsx           # Signup with role selection (Employee/Manager)
│   └── Dashboard.jsx            # Main dashboard with request management
├── store/
│   └── authStore.js             # Zustand store for authentication state
├── styles/
│   ├── index.css                # Global styles and CSS variables
│   ├── auth.css                 # Authentication pages styling
│   ├── dashboard.css            # Dashboard layout and components
│   └── components.css           # Reusable component styles
├── utils/
│   └── toast.js                 # Toast notification utility
├── App.jsx                      # Main app with routing setup
└── main.jsx                     # React entry point
\`\`\`

## API Integration

The frontend connects to the Express backend API with complete CRUD operations:

### Authentication Endpoints
- `POST /auth/login` - Login with email and password
- `POST /auth/register` - Create new account with role selection
- `GET /auth/me` - Get current user information

### Request Endpoints
- `GET /requests` - Get all requests with optional filters
- `POST /requests` - Create new request (assign to employee)
- `POST /requests/:id/approve` - Approve request (manager only)
- `POST /requests/:id/reject` - Reject request with notes (manager only)
- `POST /requests/:id/close` - Close approved request (assigned employee only)
- `GET /requests/:id/actions` - Get complete request action history

## Business Rules

### Request Workflow

1. **Employee** creates a request and assigns it to another employee
2. **Manager** of the assigned employee can approve or reject the request
3. Only the **assigned employee** can close an approved request
4. Request statuses: `pending` → `approved`/`rejected` → `closed`

### Role-Based Actions

**Employee Role:**
- Create new requests and assign to other employees
- Close approved requests assigned to them
- View all requests and their history
- Cannot approve or reject requests

**Manager Role:**
- Approve pending requests for their direct reports
- Reject pending requests with optional notes
- View all requests in the system
- Cannot create or close requests

## Authentication Flow

1. User registers or logs in on the auth pages
2. Backend validates credentials and returns JWT token
3. Token is stored in browser cookies (automatically handled)
4. Token is automatically injected in all API requests via axios interceptors
5. Protected routes check authentication state from Zustand store
6. Expired or missing tokens redirect user to login page

## State Management

Uses **Zustand** for lightweight, efficient state management:

**authStore:**
- `user` - Current user object (employee data)
- `token` - JWT authentication token
- `isAuthenticated` - Boolean authentication status
- `setAuth()` - Set user and token (also saves to cookies)
- `logout()` - Clear auth state and cookies
- `loadFromCookie()` - Restore auth state from saved cookies

## Styling System

Uses CSS custom properties (variables) for consistent theming:

\`\`\`css
--primary: #2563eb              /* Primary blue */
--primary-dark: #1e40af         /* Darker blue for hover states */
--success: #16a34a              /* Green for approve/success */
--danger: #dc2626               /* Red for reject/danger */
--warning: #ea580c              /* Orange for warnings */
--bg-primary: #ffffff           /* White backgrounds */
--bg-secondary: #f9fafb         /* Light gray backgrounds */
--text-primary: #1f2937         /* Dark text */
--text-secondary: #6b7280       /* Medium gray text */
--border: #e5e7eb               /* Border color */
\`\`\`

## Error Handling

- API errors are caught and displayed as toast notifications
- Form validation errors show inline with error messages
- 401 Unauthorized responses automatically redirect to login
- Network errors are handled gracefully with user feedback
- Request failures show specific error messages from backend

## Key Features Explained

### Request Card Actions
- **Approve** (Manager): Shows input for optional notes, approves the request
- **Reject** (Manager): Shows input for rejection reason, rejects with notes
- **Close** (Assigned Employee): Can only close approved requests, adds closure notes
- **View History**: Shows complete audit trail of all actions on the request

### Request Filtering
- **All Requests**: Display all requests in any status
- **Pending**: Requests waiting for manager approval
- **Approved**: Requests that have been approved by manager
- **Rejected**: Requests that were rejected by manager
- **Closed**: Completed requests that are now closed

## Development Tips

1. **API Debugging**: Use browser DevTools Network tab to inspect all API calls
2. **State Inspection**: Zustand state accessible via `authStore` in console
3. **Token Inspection**: JWT token visible in Application → Cookies
4. **Component Testing**: Each component is self-contained and reusable
5. **Theme Customization**: Modify CSS variables in `index.css` for quick theme changes

## Deployment

### Deploy to Vercel

\`\`\`bash
npm run build
# Connect GitHub repo to Vercel dashboard
# Set environment variable: VITE_API_URL to your backend URL
\`\`\`

### Deploy to Other Platforms

\`\`\`bash
npm run build
# Deploy the `dist/` folder to your hosting service
# Set VITE_API_URL environment variable on your hosting platform
\`\`\`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to backend | Ensure backend runs on http://localhost:5000, check VITE_API_URL in .env |
| Login fails | Verify credentials, check backend is running and database is initialized |
| Requests not loading | Check browser console, verify JWT token sent in headers, check backend response format |
| Cannot approve/reject | Verify logged-in user is a manager, check manager_id relationship in backend |
| CORS errors | Configure CORS in backend Express app to allow frontend URL |
| Token expiration | Re-login to get new token, token stored in secure cookies |

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

## Environment Variables

**VITE_API_URL** (required)
- Backend API base URL
- Default: `http://localhost:5000/api`
- Change if backend is deployed elsewhere

## License

MIT
