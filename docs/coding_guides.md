is # Pulse9 Coding Guides

## Code Structure
- **src/app**: Next.js page routes and layouts
- **src/components**: Reusable UI components
- **src/actions**: Server actions for data operations
- **src/lib**: Shared utilities and middleware
- **src/types**: TypeScript type definitions
- **src/providers**: Context providers

## Style Guidelines
1. **TypeScript**:
   - Strict typing enabled
   - Interfaces for complex data structures
   - Type imports from dedicated files

2. **React/Next.js**:
   - Functional components with TypeScript
   - Server components where possible
   - Client components marked with 'use client'

3. **Styling**:
   - CSS modules for component-specific styles
   - Consistent spacing and typography

## Libraries Used
- **Frontend**:
  - Next.js
  - Tiptap (rich text editor)
  - Axios (HTTP client)

- **Backend**:
  - Prisma (ORM)
  - NextAuth (authentication)

- **Utilities**:
  - TypeScript
  - PostCSS
  - ESLint (likely based on package.json)