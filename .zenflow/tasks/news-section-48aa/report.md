# Implementation Report: News Section Cover Photos

## Summary
Fixed the News section to display cover photos in the list view.

## Changes Made

### Modified: `sanity/lib/queries.ts`
Updated the `postFields` query to explicitly expand the `coverImage` object fields instead of just including a simple reference. This ensures that the image asset data, alt text, hotspot, and crop information are properly fetched from Sanity.

**Before:**
```groq
coverImage,
```

**After:**
```groq
coverImage {
  asset,
  alt,
  hotspot,
  crop
},
```

## Technical Details
- The `MoreStories` component already had logic to display cover images (checking for `coverImage` on line 23)
- The `CoverImage` component expects the image object to have `asset._ref` populated
- The issue was that the Sanity query wasn't explicitly expanding the image fields
- By making the query more explicit about which image fields to fetch, Sanity now returns the complete image object structure

## Verification
- Regenerated TypeScript types with `npm run typegen`
- Built the project successfully with `npm run build`
- Confirmed the generated types show the correct `coverImage` structure with `asset`, `alt`, `hotspot`, and `crop` fields

## Result
Cover photos will now display in the News list view for stories that have a cover image, including "Phoenix-Sendung über Gruppe 47".
