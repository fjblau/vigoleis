# Albert Vigoleis Thelen Tribute Site - Setup Guide

This is a modern, responsive website built with Next.js and Sanity CMS to honor the life and works of Albert Vigoleis Thelen.

## Features

- 📰 **News Section**: Blog-style articles and updates
- 🖼️ **Photo Gallery**: Image galleries with categories
- 🔗 **Links & Ephemera**: Curated resources and rare materials
- 🛍️ **Shop**: Memorabilia store (placeholder, ready for integration)
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ✏️ **Easy Content Management**: Sanity CMS with visual editing interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity Studio
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)
- **Language**: TypeScript

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Sanity CMS

Run the setup command to create your Sanity project:

\`\`\`bash
npm run setup
\`\`\`

Follow the prompts to:
- Create a new Sanity project or connect to an existing one
- Choose a dataset name (e.g., "production")
- Configure authentication

This will automatically update your `.env.local` file with the correct values.

### 3. Create a Read Token

1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Give it a name (e.g., "Read Token")
6. Set permissions to **Viewer**
7. Copy the token and add it to `.env.local`:

\`\`\`
SANITY_API_READ_TOKEN=your_token_here
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit:
- **Website**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## Project Structure

\`\`\`
.
├── app/
│   ├── (blog)/           # Main website pages
│   │   ├── page.tsx      # Home page
│   │   ├── news/         # News/articles section
│   │   ├── gallery/      # Photo gallery
│   │   ├── links/        # Links & ephemera
│   │   ├── shop/         # Shop (placeholder)
│   │   └── posts/        # Individual blog posts
│   └── (sanity)/
│       └── studio/       # Sanity CMS interface
├── sanity/
│   ├── lib/              # Sanity utilities
│   └── schemaTypes/      # Content schemas
└── components/           # Reusable React components
\`\`\`

## Content Management

### Adding Content

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000/studio
3. Log in with your Sanity credentials
4. Use the interface to add:
   - **Posts**: News articles and updates
   - **Settings**: Site title, description, and footer
   - **Media**: Upload images and files

### Content Types

The site currently includes:
- **Post**: Articles with title, content, cover image, author, and date
- **Author**: Author profiles with name and picture
- **Settings**: Global site configuration

To extend with gallery, links, and shop features, you'll need to:
1. Add new schema types in `sanity/schemaTypes/`
2. Create corresponding queries in `sanity/lib/queries.ts`
3. Update the pages to fetch and display the new content

## Deploying to Vercel

### Quick Deploy (Without Sanity Setup)

The site can be deployed immediately without configuring Sanity. It will build successfully with placeholder credentials and show the static pages.

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository: `fjblau/vigoleis`
4. Click **Deploy** (no environment variables needed yet)

Your site will be live at `https://your-project.vercel.app` with placeholder content.

### Setting Up Sanity CMS (After Deployment)

Once your site is deployed, set up Sanity to enable content management:

#### 1. Create Sanity Project Locally

\`\`\`bash
npm run setup
\`\`\`

Follow the prompts to create your Sanity project. This will update `.env.local` with real credentials.

#### 2. Create a Read Token

1. Go to https://www.sanity.io/manage
2. Select your project → **API** → **Tokens**
3. Click **Add API token**
4. Name it "Read Token" with **Viewer** permissions
5. Copy the token

#### 3. Update Vercel Environment Variables

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add the values from your `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = production
   - `SANITY_API_READ_TOKEN` = your read token
3. **Redeploy** to apply changes

#### 4. Configure CORS

1. Go to https://www.sanity.io/manage
2. Select your project → **API** → **CORS Origins**
3. Add your Vercel URL: `https://your-project.vercel.app`
4. Also add: `http://localhost:3000` (for local development)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Set up Sanity project
- `npm run typegen` - Generate TypeScript types from Sanity schema

## Customization

### Branding

Update the site title and description in:
- `sanity/lib/demo.ts` (fallback values)
- Sanity Studio → Settings (for live content)

### Colors & Styling

Modify Tailwind configuration:
- `tailwind.config.ts` - Customize colors, fonts, spacing
- `app/globals.css` - Add custom CSS

### Navigation

Edit the header component:
- `app/(blog)/header.tsx` - Add/remove navigation links

## Next Steps

### To add full CMS support for Gallery, Links, and Shop:

1. **Define Schemas**: Create schema types for photos, links, and products in `sanity/schemaTypes/`
2. **Create Queries**: Add GROQ queries in `sanity/lib/queries.ts`
3. **Update Pages**: Replace placeholder content with real CMS data
4. **Add E-commerce**: Integrate Shopify or Stripe for the shop

### Recommended Integrations:

- **E-commerce**: Shopify, Stripe, or Snipcart
- **Email**: SendGrid or Mailchimp for newsletters
- **Analytics**: Vercel Analytics or Google Analytics
- **Search**: Algolia or local search implementation

## Support

For issues or questions:
- Next.js: https://nextjs.org/docs
- Sanity: https://www.sanity.io/docs
- Vercel: https://vercel.com/docs

## License

This project is set up for personal use. Adjust licensing as needed for your specific requirements.
