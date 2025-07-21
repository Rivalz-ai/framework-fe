# Swarm Control Frontend

A Next.js application for swarm control with AI chat capabilities, built with modern React and TypeScript.

## Features

- 📊 Interactive data visualization with Plotly
- 🎨 Modern UI with Radix UI components and Tailwind CSS
- 📝 Markdown rendering with math support (KaTeX)
- 🔐 Authentication with NextAuth.js
- 📱 Responsive design with mobile support

## Tech Stack

- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Recoil, Jotai, TanStack Query
- **Markdown**: react-markdown with remark/rehype plugins
- **Authentication**: NextAuth.js
- **Charts**: Plotly.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by copying the appropriate env file:

```bash
# For development
cp .env.example .env.dev

# For production
cp .env.example .env.main

# For staging
cp .env.example .env.staging
```

### Development

Run the development server:

```bash
# Development environment (port 5173)
npm run dev

# Production environment
npm run dev-pro

# Staging environment
npm run dev-stg
```

Open [http://localhost:5173](http://localhost:5173) (or the appropriate port) to view the application.

### Building

```bash
# Build for production
npm run build:prod

# Build for development
npm run build:dev

# Standard build
npm run build
```

### Other Commands

```bash
# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/
│   └── customs/
│       ├── chat/           # Chat interface components
│       ├── markdown.tsx    # Markdown renderer
│       └── ...
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── lib/                    # Utility functions
└── ...
```

## Key Features

### Markdown Support

The application includes advanced markdown rendering with:

- GitHub Flavored Markdown (GFM)
- Math equations (KaTeX)
- Code syntax highlighting
- Custom directives and alerts
- HTML support

### Chat Interface

- Message threading
- Custom markdown rendering for chat messages

### Development Tools

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## Environment Configuration

The project supports multiple environments:

- **Development**: `.env.dev` - Testnet configuration
- **Staging**: `.env.staging` - Staging environment
- **Production**: `.env.main` - Main production environment

## License

Private project - All rights reserved.
# framework-fe
