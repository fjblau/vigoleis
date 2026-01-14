# Claude AI Assistant Guide

This file contains important information for AI assistants working on this project.

## Project Overview

This is a statically generated website for Albert Vigoleis Thelen built with:
- **Framework**: Next.js (App Router)
- **CMS**: Sanity
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Working with Zenflow Worktrees

When working in a Zenflow worktree (task branch):

1. After running `npm install`, always run:
   ```bash
   npm run copy-env
   ```
   This copies `.env.local` from the main project to the current worktree, ensuring Sanity environment variables are available.

2. Without this step, builds and dev server will fail with missing environment variable errors.

## Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production version
- `npm run lint` - Run linter (note: project uses ESLint v9 config)
- `npm run typegen` - Generate TypeScript types from Sanity schema
- `npm run copy-env` - Copy environment variables from main project (for Zenflow worktrees)

## Project Structure

- `app/(blog)/` - Main blog pages and components
  - `header.tsx` - Navigation header component
  - `[page]/page.tsx` - Individual page components
- `sanity/` - Sanity CMS configuration and schemas
- `scripts/` - Utility scripts

## Important Notes

- The project requires Sanity environment variables to build/run
- Header navigation is managed in `app/(blog)/header.tsx`
- New pages go in `app/(blog)/[page-name]/page.tsx`
- Always maintain consistent styling with existing components
- TypeScript types are auto-generated from Sanity schemas

## Verification Steps

Before completing tasks, always:
1. Run `npm run build` to verify compilation
2. Check that all pages build successfully
3. Verify TypeScript types are correct
