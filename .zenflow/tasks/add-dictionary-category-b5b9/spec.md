# Technical Specification: Add Dictionary Category

## Difficulty Assessment
**Easy** - Straightforward implementation involving adding a navigation link and creating a placeholder page.

## Technical Context
- **Framework**: Next.js (App Router)
- **Language**: TypeScript/React
- **Styling**: Tailwind CSS
- **Architecture**: Server Components (React Server Components)

## Current State
The header navigation is located at `app/(blog)/header.tsx` and contains the following menu items:
- Home (/)
- Biography (/biography)
- News (/news)
- Bibliography (/bibliography)
- Gallery (/gallery)
- Links & Ephemera (/links)
- Shop (/shop)

Each menu item corresponds to a page in the `app/(blog)/` directory structure using Next.js App Router conventions.

## Implementation Approach

### 1. Add Dictionary Link to Header
Modify `app/(blog)/header.tsx` to add a new navigation item for "Dictionary" between the existing menu items. The link should:
- Follow the same styling pattern as existing menu items
- Use the same hover effects and transitions
- Link to `/dictionary`
- Be inserted in an appropriate position (suggested: after Bibliography, before Gallery)

### 2. Create Dictionary Placeholder Page
Create a new directory and page file at `app/(blog)/dictionary/page.tsx` with:
- Basic Next.js page structure
- Metadata export with title "Dictionary"
- Simple placeholder content indicating the page is coming soon
- Consistent styling with other pages (container, padding, heading structure)

## Source Code Changes

### Files to Modify
1. `app/(blog)/header.tsx` - Add Dictionary navigation link

### Files to Create
1. `app/(blog)/dictionary/page.tsx` - Placeholder page component

## Data Model / API / Interface Changes
None - this is a pure UI change with no backend requirements.

## Verification Approach

### Manual Testing
1. Start development server (`npm run dev`)
2. Navigate to http://localhost:3001
3. Verify Dictionary link appears in header navigation
4. Click Dictionary link and verify it navigates to /dictionary
5. Verify placeholder page renders correctly
6. Verify styling is consistent with other pages

### Automated Testing
1. Run linter: `npm run lint`
2. Build the application: `npm run build`

## Implementation Notes
- No special routing configuration needed (Next.js App Router handles this automatically)
- No Sanity CMS integration required for placeholder page
- Page content will be determined later, so keep implementation minimal and easily modifiable
