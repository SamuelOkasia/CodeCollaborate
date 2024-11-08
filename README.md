# CodeCollaborate

CodeCollaborate is a real-time collaborative platform for code review and editing. The application allows users to log in, submit code snippets, and collaborate in real-time with other users. It is built using modern web technologies including Next.js, React, Redux, Socket.IO, and Prisma.

## Table of Contents
- Features
- Technologies Used
- Installation
- Environment Variables
- Running the Project
- Usage
- Future Enhancements

## Features
- **Real-Time Code Collaboration:** Multiple users can view and edit code simultaneously with real-time updates.
- **Role-Based Access Control:** Users can be admins, contributors, or reviewers, with different permissions.
- **User Authentication:** Supports social login with Google and GitHub.
- **Code Submission:** Users can submit code for review.
- **Responsive Design:** Accessible on different screen sizes.

## Technologies Used
- **Frontend:**
    - Next.js (with TypeScript)
    - React
    - Redux Toolkit
    - Socket.IO (for real-time communication)
    - Tailwind CSS (for styling)
    - Monaco Editor (for code editing)
    
- **Backend:**
    - Node.js
    - Express
    - Socket.IO
    - Prisma ORM
    - PostgreSQL (database)
    
- **Dev Tools:**
    - Docker (for containerization)
    <!-- Jest & React Testing Library (for testing) -->
    - ESLint & Prettier (for code linting and formatting)

## Installation
- Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- PostgreSQL (running locally or on a server)

## Clone the Repository
```bash
git clone https://github.com/yourusername/CodeCollaborate.git
cd CodeCollaborate
```

## Install Dependencies
### Backend
```bash
cd backend
npm install
```

### Frontend
```
cd ../frontend
npm install
```

## Environment Variables
Create a .env file in both the backend and frontend directories and add the following environment variables:

### Backend
```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>?schema=public
JWT_SECRET=your_jwt_secret
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Project

### Backend
Navigate to the backend directory and run:

```bash
npm start
```
This starts the Express server on http://localhost:5000.

### Frontend
Navigate to the frontend directory and run:

```bash
npm run dev
This starts the Next.js development server on http://localhost:3000.
```

## Usage
1. Navigate to http://localhost:3000 to access the frontend.
2. Log in using your preferred method (Google or GitHub).
3. Contributors can submit code snippets for review.
4. Reviewers can view and edit the code in real-time.
5. Admins have access to manage user roles and submissions.

## Future Enhancements
- Real-Time Notifications: Notify users when their code has been reviewed or updated.
- Activity Feed: Track all user actions, such as submissions and feedback.
- Mobile App: Develop a companion app using React Native.
- AI-Powered Code Suggestions: Integrate AI to provide suggestions during code reviews.