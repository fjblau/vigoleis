import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function deleteAllPosts() {
  console.log('Fetching all posts...');
  
  const posts = await client.fetch(`*[_type == "post"]`);
  
  console.log(`Found ${posts.length} posts to delete`);
  
  if (posts.length === 0) {
    console.log('No posts to delete');
    return;
  }
  
  console.log('Deleting posts...');
  
  for (const post of posts) {
    await client.delete(post._id);
    console.log(`Deleted: ${post.title}`);
  }
  
  console.log('\n✓ All posts deleted');
}

deleteAllPosts().catch(console.error);
