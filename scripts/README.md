# WordPress Import Script

This script imports news posts from the WordPress XML export into Sanity CMS.

## Setup

1. **Create a Write Token** in Sanity:
   - Go to https://www.sanity.io/manage
   - Select your project
   - Navigate to **API** → **Tokens**
   - Click **Add API token**
   - Name: "Import Token"
   - Permissions: **Editor** (needed to write data)
   - Copy the token

2. **Add token to `.env.local`**:
   ```
   SANITY_API_WRITE_TOKEN=your_write_token_here
   ```

3. **Run the import**:
   ```bash
   npm run import
   ```

## What it does

- Parses `vigoleis_wordpress.xml`
- Filters for published news posts
- Converts HTML to Sanity's Portable Text format
- Creates author "Jürgen Pütz" if needed
- Imports posts with title, date, slug, content, and excerpt
- Skips posts that already exist (based on slug)

## After import

Check your Sanity Studio at `/studio` to see the imported posts.
