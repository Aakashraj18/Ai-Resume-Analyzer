# AI Resume Analyzer

AI Resume Analyzer is a full-stack web application that helps job seekers optimize resumes for ATS (Applicant Tracking System) compatibility. It supports PDF resume uploads, secure user authentication, MongoDB-backed storage, and AI-powered resume analysis using Google Gemini.

## Key Features

- User authentication with JWT and secure password hashing
- PDF resume upload with file validation and GridFS storage
- AI-driven ATS compatibility analysis for resume vs. job description
- Clear resume scoring, keyword gap detection, formatting feedback, and actionable tips
- Responsive React UI with reusable components and modern design
- Server-side API built with Express and React Router

## Live Link
- https://ai-resume-analyzer-82lg.onrender.com

## Technology Stack

### Frontend

- React 19
- React Router 7
- Tailwind CSS 4
- React Dropzone
- clsx + tailwind-merge
- TypeScript

### Backend

- Node.js / Express
- MongoDB + Mongoose
- GridFS for PDF storage
- JWT authentication
- dotenv for environment management
- Multer for file uploads

### AI & Integrations

- Google Gemini AI via `@google/genai`
- Custom resume analysis prompt to generate structured ATS reports

## Architecture Overview

- `app/` contains the frontend application, routes, and reusable components
- `server/` contains the backend API, authentication middleware, upload handling, and AI service integration
- `config/` stores database configuration and helper utilities
- `models/` defines MongoDB schemas for analysis and user data
- `routes/` exposes API endpoints for auth, resume upload, and analysis
- `services/` handles external integrations, including Google Gemini AI

## Environment Variables

Create a `.env` file with at least the following:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

## Development

Run the client and server together in development mode:

```bash
npm run dev
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Notes

- This project is designed for secure resume upload and AI analysis.
- PDF files are stored using MongoDB GridFS and served via secure authenticated endpoints.
- AI analysis is driven by Google Gemini, which requires a valid API key.
