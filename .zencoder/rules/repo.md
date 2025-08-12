---
description: Repository Information Overview
alwaysApply: true
---

# Vigoleis-Modern Information

## Summary
A modern React-based web application for Vigoleis.de, featuring information about German author Albert Vigoleis Thelen. The project is a single-page application built with React, TypeScript, and Tailwind CSS, using Vite as the build tool.

## Structure
- `src/`: Contains React components, styles, and application logic
- `public/`: Static assets (implied by Vite structure)
- `.codesandbox/`: Configuration for CodeSandbox development environment
- `.zencoder/`: Configuration for Zencoder

## Language & Runtime
**Language**: TypeScript, JavaScript (React)
**Version**: TypeScript 5.5.3, React 18.2.0
**Build System**: Vite 5.3.4
**Package Manager**: npm/pnpm (pnpm-lock.yaml present)

## Dependencies
**Main Dependencies**:
- react: ^18.2.0
- react-dom: ^18.2.0
- framer-motion: ^11.0.0
- lucide-react: ^0.452.0

**Development Dependencies**:
- typescript: ^5.5.3
- vite: ^5.3.4
- @vitejs/plugin-react
- tailwindcss: ^3.4.10
- postcss: ^8.4.38
- autoprefixer: ^10.4.19
- @types/react: ^18.2.20
- @types/react-dom: ^18.2.7

## Build & Installation
```bash
# Install dependencies
npm install
# or
pnpm install

# Development server
npm run dev
# or
pnpm dev

# Production build
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

## Application Structure
**Entry Point**: `src/main.tsx` - Renders the React application into the DOM
**Main Component**: `src/App.tsx` - Contains the application logic and UI components
**Styling**: Uses Tailwind CSS for styling with configuration in `tailwind.config.js`
**Configuration**:
- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript compiler options
- `postcss.config.js`: PostCSS configuration for Tailwind

## Features
- Multi-language support (German/English)
- Interactive navigation
- Shopping cart functionality (demo)
- Dictionary search
- News section
- Author information
- Responsive design using Tailwind CSS
- Animations with Framer Motion