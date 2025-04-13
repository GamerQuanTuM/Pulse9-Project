# Pulse9 System Architecture

## High-Level Architecture
Pulse9 follows a modern web application architecture with:
- Frontend: Next.js application with TypeScript
- Backend: API routes within Next.js
- Database: Prisma ORM connecting to a database (likely PostgreSQL based on migrations)
- Authentication: Custom auth system with middleware

## Key Components
1. **Frontend**
   - Next.js pages and components
   - Context API for state management
   - Tiptap rich text editor

2. **Backend**
   - API routes in `/app/api`
   - Server actions for data operations
   - Authentication middleware

3. **Database**
   - Prisma schema defining data models
   - Migrations for schema evolution

4. **Types**
   - TypeScript types for data structures
   - Utility functions and constants

## Data Flow
1. User interacts with Next.js frontend
2. Frontend calls API routes or server actions
3. Backend processes requests with auth middleware
4. Prisma ORM handles database operations
5. Responses flow back through the same path