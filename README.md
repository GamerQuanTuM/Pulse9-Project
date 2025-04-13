# Pulse9 Getting Started Guide

## Prerequisites
- Node.js (version 18 or higher)
- pnpm (package manager)
- Docker (for database container)

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up database:
   - Start Docker
   - Run database container:
     ```bash
     docker-compose up -d
     ```
4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

## Running the Application
1. Start development server:
   ```bash
   pnpm dev
   ```
2. Open browser to:
   ```
   http://localhost:3000
   ```

## Environment Variables
Create a `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/pulse9"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```
