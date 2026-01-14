# Technical Specification: Import Signature to Header

## Difficulty Assessment
**Easy** - Straightforward image import and header component update

---

## Technical Context

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Location**: `/Users/frankblau/Documents/vigoleis-pics/sig.jpg`
- **Target Component**: `app/(blog)/header.tsx`
- **Image Storage**: `public/images/` directory

---

## Implementation Approach

### 1. Import Image Asset
- Copy `sig.jpg` from source location to `public/images/sig.jpg`
- Follow existing pattern where images are stored in `public/images/` (e.g., `thelen-portrait.jpg`)

### 2. Replace Header Text with Signature Image
- Replace the text "Albert Vigoleis Thelen" (line 9 in `header.tsx`) with the signature image
- Use Next.js `Image` component for optimization
- Size the image appropriately for the header (height should match or complement the navigation items)
- Maintain the Link wrapper for home page navigation

### 3. Image Sizing Considerations
- **Height**: Approximately 40-60px to match header proportions
- **Width**: Auto-scale based on image aspect ratio
- **Alt text**: "Albert Vigoleis Thelen" for accessibility
- **Priority**: Consider adding `priority` prop since it's in the header

---

## Source Code Changes

### Files to Modify
1. **`app/(blog)/header.tsx`**
   - Import Next.js `Image` component
   - Replace text content in the Link component (lines 8-10) with Image component
   - Adjust Tailwind classes as needed for proper image display

### Files to Create
None - image file will be copied manually or via script

---

## Data Model / API Changes
None required - this is a purely frontend component change

---

## Implementation Details

### Updated Header Component
Replace the Link content:

```tsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-accent-2 bg-white">
      <div className="container mx-auto px-5">
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/sig.jpg"
              alt="Albert Vigoleis Thelen"
              width={200}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>
          {/* navigation items remain unchanged */}
```

**Note**: Width/height values may need adjustment based on actual image dimensions and visual preference

---

## Verification Approach

### Manual Testing
1. Copy image file to `public/images/sig.jpg`
2. Start dev server: `npm run dev`
3. Navigate to any page (http://localhost:3001) to see header
4. Verify signature image appears in header left position
5. Verify image is properly sized and aligned with navigation
6. Click signature to ensure home page navigation works
7. Test responsiveness on different screen sizes

### Build Verification
```bash
npm run build
```
Ensure build succeeds without errors

### Type Checking
```bash
npm run lint
```

---

## Potential Issues & Considerations

1. **Image dimensions**: May need to adjust width/height values based on actual image aspect ratio
2. **Image size**: Signature image may need optimization if file size is large
3. **Header height**: Image height should not make header too tall
4. **Mobile experience**: Verify header looks good on mobile devices (may need responsive sizing)
5. **Accessibility**: Alt text should be descriptive for screen readers

---

## Success Criteria

- [ ] Signature image copied to `public/images/sig.jpg`
- [ ] Signature visible in header, replacing text
- [ ] Header navigation to home page works
- [ ] Image properly sized for header
- [ ] Build completes successfully
- [ ] No linting errors
- [ ] Responsive design maintained
