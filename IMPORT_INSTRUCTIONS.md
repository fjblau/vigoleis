# WordPress to Sanity Import Instructions

## Summary

Successfully extracted **72 News posts** from WordPress export and converted to Sanity NDJSON format.

**Output Files:**
- `output/news_import.ndjson` - 74 documents ready for import (1 category + 1 author + 72 posts)
- `output/news_summary.json` - Import statistics

## Required Schema Changes

Before importing, you need to add a **category** schema to your Sanity project.

### Step 1: Create Category Schema

Create file: `sanity/schemas/documents/category.ts`

```typescript
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  icon: TagIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
});
```

### Step 2: Update Post Schema

Add category field to `sanity/schemas/documents/post.ts`:

```typescript
// Add this import at the top
import categoryType from "./category";

// Add this field to the fields array (around line 93, after author field)
defineField({
  name: "category",
  title: "Category",
  type: "reference",
  to: [{ type: categoryType.name }],
}),
```

### Step 3: Update Sanity Config

Update `sanity.config.ts` to include the category schema:

```typescript
// Add import
import category from "@/sanity/schemas/documents/category";

// Update schema.types array
schema: {
  types: [
    // Singletons
    settings,
    // Documents
    post,
    author,
    category,  // Add this line
  ],
},
```

## Import Process

### 1. Navigate to Website Directory

```bash
cd /Users/frankblau/.zenflow/worktrees/understand-abilities-3278
```

### 2. Copy Import File

```bash
cp /Users/frankblau/.zenflow/worktrees/understand-existing-content-943c/output/news_import.ndjson .
```

### 3. Import to Sanity

**Test with dry run first:**
```bash
npx sanity dataset import news_import.ndjson production --replace --missing
```

**Actual import:**
```bash
npx sanity dataset import news_import.ndjson production
```

**Note:** The `--replace` flag will overwrite existing documents with the same IDs. Use with caution.

### 4. Verify Import

1. Open Sanity Studio: `npm run dev`
2. Navigate to http://localhost:3001/studio
3. Check for "News" category
4. Verify posts appear under Posts section
5. Check that posts have category references

## What Was Imported

- **1 Category**: "News" (German: "News")
- **1 Author**: "admin" (Jürgen Pütz)
- **72 Posts**: News articles from 2004-2026
  - All posts reference the News category
  - All posts reference the admin author
  - HTML content converted to Portable Text
  - German characters (ä, ö, ü, ß) preserved
  - Dates preserved in ISO format

## Next Steps

After verifying the News import works correctly, you can process the remaining WordPress sections:

1. **Der Autor** (Author biography pages)
2. **Shop** (Shop items/products)
3. **Wörterbuch** (Dictionary entries)
4. **Kontakt** (Contact pages)

To import other sections, modify `parse_wordpress.py`:

```python
# For "Der Autor" section
converter.convert(category_filter='autor')

# For "Shop" section
converter.convert(category_filter='shop')

# etc.
```

## Troubleshooting

### Import Errors

If you get errors during import:
- Ensure category schema is created first
- Verify post schema has category field
- Check that sanity.config.ts includes category in types

### Missing Content

If content appears empty:
- Check that Portable Text is rendering in your frontend
- Verify the content field in post schema is `type: 'array'`

### Duplicate Slugs

Some posts may have duplicate titles. The parser handles this by appending post IDs to slugs when needed.

## Data Structure

Each post in the NDJSON file has this structure:

```json
{
  "_id": "unique-hash-id",
  "_type": "post",
  "title": "Post Title",
  "slug": {
    "current": "post-title-slug",
    "_type": "slug"
  },
  "content": [
    {
      "_type": "block",
      "children": [...]
    }
  ],
  "excerpt": "First 200 characters...",
  "category": {
    "_type": "reference",
    "_ref": "category-id"
  },
  "author": {
    "_type": "reference",
    "_ref": "author-id"
  },
  "date": "2025-12-30T00:00:00Z"
}
```
