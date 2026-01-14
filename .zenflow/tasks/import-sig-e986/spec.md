# Technical Specification: Import Signature Background

## Difficulty Assessment
**Easy** - Straightforward image import and CSS background application

---

## Technical Context

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Location**: `/Users/frankblau/Documents/vigoleis-pics/sig.jpg`
- **Target Page**: `app/(blog)/page.tsx` (home page)
- **Image Storage**: `public/images/` directory

---

## Implementation Approach

### 1. Import Image Asset
- Copy `sig.jpg` from source location to `public/images/sig.jpg`
- Follow existing pattern where images are stored in `public/images/` (e.g., `thelen-portrait.jpg`)

### 2. Apply Background to Home Page
Apply the signature image as a background on the home page component. Implementation options:

**Option A: Full page background**
- Add background to the root `<div>` container in the page component
- Use Tailwind CSS background utilities or inline styles
- Ensure proper opacity/positioning so content remains readable

**Option B: Section-specific background**
- Apply background to the `<Intro>` section or another specific section
- More targeted and potentially better for content readability

**Recommended**: Option A with subtle opacity to ensure text readability

### 3. Background Styling Considerations
- **Position**: Center or custom positioning based on visual preference
- **Size**: Cover, contain, or auto depending on desired effect
- **Repeat**: No-repeat to prevent tiling
- **Opacity**: Reduce opacity (e.g., 0.05-0.15) to keep content readable
- **Color overlay**: Optional light overlay to improve text contrast

---

## Source Code Changes

### Files to Modify
1. **`app/(blog)/page.tsx`**
   - Add background image styling to the root container or specific section
   - Use Next.js Image optimization or CSS background-image

### Files to Create
None - image file will be copied manually or via script

---

## Data Model / API Changes
None required - this is a purely frontend styling change

---

## Implementation Details

### Styling Approach
Using Tailwind CSS with inline styles for background image:

```tsx
<div 
  className="container mx-auto px-5"
  style={{
    backgroundImage: 'url(/images/sig.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    opacity: 0.1 // Applied to background only
  }}
>
```

Or using a wrapper div with opacity control:

```tsx
<div className="relative">
  <div 
    className="absolute inset-0 opacity-10 bg-no-repeat bg-center bg-contain"
    style={{ backgroundImage: 'url(/images/sig.jpg)' }}
  />
  <div className="relative z-10">
    {/* existing content */}
  </div>
</div>
```

**Recommended**: Second approach for better opacity control without affecting content

---

## Verification Approach

### Manual Testing
1. Copy image file to `public/images/sig.jpg`
2. Start dev server: `npm run dev`
3. Navigate to home page (http://localhost:3001)
4. Verify signature appears as background
5. Verify text content remains readable
6. Test responsiveness on different screen sizes

### Build Verification
```bash
npm run build
```
Ensure build succeeds without errors

### Type Checking
No TypeScript changes required, but verify with:
```bash
npm run lint
```

---

## Potential Issues & Considerations

1. **Image size**: Signature image may need optimization if file size is large
2. **Readability**: Background opacity must be subtle enough to maintain text readability
3. **Positioning**: May need adjustment based on visual preference
4. **Mobile experience**: Verify background looks good on mobile devices
5. **Accessibility**: Ensure sufficient contrast ratio for text over background

---

## Success Criteria

- [ ] Signature image copied to `public/images/sig.jpg`
- [ ] Background visible on home page
- [ ] Text content remains clearly readable
- [ ] Build completes successfully
- [ ] No linting errors
- [ ] Responsive design maintained
