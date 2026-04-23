# Bookstore Management System

A full-featured bookstore management system built with React (Vite + TypeScript) and Node.js/Express backend.

## Features

- **User Authentication**: Login and signup functionality
- **Book Management**: Browse, search, and view book details
- **Book Issuing**: Issue books for reading (7-day return period)
- **Purchasing**: Buy books directly
- **Notifications**: Get updates about due dates and new books
- **User Profile**: Update personal information
- **Search**: Find books by title, author, or genre

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Router for navigation
- React Query for state management

### Backend
- Node.js with Express
- JSON file-based database (for simplicity)
- JWT authentication
- bcrypt for password hashing
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd my-book-haven-93
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd my-book-haven-93
   npm run dev
   ```
   The frontend will run on http://localhost:8080

### Default User Credentials

- **Email**: test@gmail.com
- **Password**: 123456

## API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/login` - User login
- `GET /api/v1/verify` - Verify authentication token
- `POST /api/logout` - Logout user

### Books
- `GET /api/v1/books` - Get all books
- `GET /api/v1/books/:id` - Get book by ID
- `GET /api/v1/books/search/:query` - Search books

### User Actions
- `POST /api/v1/books/:id/issue` - Issue a book
- `POST /api/v1/books/:id/return` - Return a book
- `POST /api/v1/books/:id/purchase` - Purchase a book

### User Data
- `GET /api/v1/issued` - Get user's issued books
- `GET /api/v1/purchases` - Get user's purchases
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile

## Database

The application uses a JSON file (`backend/database.json`) as the database for simplicity. The database is automatically initialized with dummy data when the server starts.

### Sample Data Includes:
- 1 default user (test@gmail.com)
- 8 sample books across different genres
- Sample issued books and purchases
- Sample notifications

## Project Structure

```
bookstore-management-system/
├── backend/
│   ├── db.js              # Database operations
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── database.json      # JSON database file
├── my-book-haven-93/      # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # This file
```

## Features Overview

### Dashboard
- Browse all available books
- Search functionality
- Issue or purchase books directly from cards

### Issued Books
- View currently issued books
- See return deadlines
- Return books

### Purchases
- View purchase history
- See total spending

### Notifications
- View system notifications
- Mark notifications as read

### Settings
- Update profile information
- Change password

### Search
- Search books by title, author, or genre
- Real-time search results

## Development

### Adding New Features
1. Update the backend API endpoints in `server.js`
2. Add corresponding database operations in `db.js`
3. Create/update frontend components and pages
4. Update routing in `App.tsx` if needed

### Styling
The application uses Tailwind CSS with shadcn/ui components. All styling is responsive and follows a consistent design system.

## License

This project is for educational purposes.

