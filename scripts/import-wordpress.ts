import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { parseStringPromise } from 'xml2js';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface WordPressPost {
  title: string[];
  pubDate: string[];
  'content:encoded': string[];
  'wp:post_date': string[];
  'wp:post_name': string[];
  'wp:status': string[];
  'wp:post_type': string[];
  category?: Array<{ _: string; $: { nicename: string } }>;
}

function htmlToPortableText(html: string) {
  const cleaned = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<em>(.*?)<\/em>/gi, '$1')
    .replace(/<strong>(.*?)<\/strong>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim());

  return paragraphs.map((text, index) => ({
    _type: 'block',
    _key: `block-${index}`,
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: `span-${index}`,
        text: text.trim(),
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

function extractExcerpt(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

async function importWordPress() {
  const xmlPath = path.join(process.cwd(), 'vigoleis_wordpress.xml');
  const xmlContent = readFileSync(xmlPath, 'utf-8');
  
  console.log('Parsing WordPress XML...');
  const result = await parseStringPromise(xmlContent);
  
  const items = result.rss.channel[0].item as WordPressPost[];
  
  console.log(`Found ${items.length} items`);
  
  const posts = items.filter(item => {
    const isPost = item['wp:post_type']?.[0] === 'post';
    const isPublished = item['wp:status']?.[0] === 'publish';
    const isNews = item.category?.some(cat => cat.$.nicename === 'news');
    const hasContent = item['content:encoded']?.[0]?.length > 100;
    
    return isPost && isPublished && isNews && hasContent;
  });
  
  console.log(`Found ${posts.length} valid news posts`);
  
  let authorId: string;
  
  try {
    const existingAuthor = await client.fetch(
      `*[_type == "author" && name == "Jürgen Pütz"][0]`
    );
    
    if (existingAuthor) {
      authorId = existingAuthor._id;
      console.log('Using existing author:', authorId);
    } else {
      const author = await client.create({
        _type: 'author',
        name: 'Jürgen Pütz',
      });
      authorId = author._id;
      console.log('Created author:', authorId);
    }
  } catch (error) {
    console.error('Error creating author:', error);
    return;
  }
  
  for (const [index, post] of posts.entries()) {
    const title = post.title[0];
    const slug = post['wp:post_name'][0];
    const date = post['wp:post_date'][0];
    const content = post['content:encoded'][0];
    
    const existingPost = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]`,
      { slug }
    );
    
    if (existingPost) {
      console.log(`Skipping existing post: ${title}`);
      continue;
    }
    
    try {
      const portableText = htmlToPortableText(content);
      const excerpt = extractExcerpt(content);
      
      await client.create({
        _type: 'post',
        title,
        slug: {
          _type: 'slug',
          current: slug,
        },
        date: new Date(date).toISOString(),
        excerpt,
        content: portableText,
        author: {
          _type: 'reference',
          _ref: authorId,
        },
      });
      
      console.log(`✓ Imported (${index + 1}/${posts.length}): ${title}`);
    } catch (error) {
      console.error(`✗ Failed to import: ${title}`, error);
    }
  }
  
  console.log('\nImport complete!');
}

importWordPress().catch(console.error);
