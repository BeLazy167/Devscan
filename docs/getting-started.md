# Getting Started

This guide will help you set up and run the project locally.

## Prerequisites

-   Node.js (v18 or higher)
-   MongoDB
-   GitHub API Token
-   Gemini API Key
-   DevPost Account

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_api_token
GEMINI_API_KEY=your_gemini_api_key
```

## Configuration

The project uses several configuration files:

-   `config/env.ts`: Environment configuration
-   `next.config.mjs`: Next.js configuration
-   `tailwind.config.ts`: Tailwind CSS configuration

## Quick Start

1. Start the development server:

```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── config/          # Configuration files
├── lib/             # Core libraries and utilities
├── public/          # Static assets
├── styles/          # Global styles
└── docs/            # Documentation
```

## Next Steps

-   Read the [Architecture Documentation](./architecture.md)
-   Check out the [API Documentation](./api/README.md)
-   Review the [Development Guide](./development.md)
