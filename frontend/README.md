# Durga Art Zone - Frontend

Production-grade Next.js frontend for jewelry e-commerce platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (to be added)
- **Data Fetching**: React Query (TanStack Query)
- **Authentication**: JWT + Google OAuth
- **Payments**: Razorpay
- **Deployment**: Vercel

## Project Structure

```
frontend/
├── app/                # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   └── providers/      # Context providers
├── lib/                # Utilities and helpers
│   ├── api/            # API client
│   └── features/       # Feature flags
├── public/             # Static assets
├── package.json        # Dependencies
└── next.config.js      # Next.js configuration
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

See `.env.example` for required variables.

All environment variables prefixed with `NEXT_PUBLIC_` are available on the client side.

## Deployment

This project is configured for Vercel deployment. Simply push to your repository and connect it to Vercel.

## Feature Flags

Frontend respects feature flags from the backend. Use the `isFeatureEnabled` utility to conditionally render features.

## Notes

- Components will be added module by module as features are built
- All UI components will follow provided Figma designs
- API integration follows RESTful patterns
- Error handling is centralized in the API client


