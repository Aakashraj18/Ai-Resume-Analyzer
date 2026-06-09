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

### Dev Tooling

- TypeScript
- Vite
- tsx
- concurrently

## Architecture Overview

- `app/` contains the frontend application, routes, and reusable components
- `server/` contains the backend API, authentication middleware, upload handling, and AI service integration
- `config/` stores database configuration and helper utilities
- `models/` defines MongoDB schemas for analysis and user data
- `routes/` exposes API endpoints for auth, resume upload, and analysis
- `services/` handles external integrations, including Google Gemini AI

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aakashraj18/Ai-Resume-Analyzer.git
   cd ai-resume-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the required variables.

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

### Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend development server
- `npm run build` - Build the frontend and backend for production
- `npm run start` - Start the production server
- `npm run typecheck` - Run React Router type generation and TypeScript checks

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

## License

This repository is private and intended for personal use.
