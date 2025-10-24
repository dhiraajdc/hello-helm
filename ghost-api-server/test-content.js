require('dotenv').config();
const GhostContentAPI = require('@tryghost/content-api');
const GhostAdminAPI = require('@tryghost/admin-api');

console.log('Testing Content API...\n');

const contentApi = new GhostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v5.0'
});

async function testContentAPI() {
  try {
    const posts = await contentApi.posts.browse({limit: 5});
    console.log('✓ Content API works!');
    console.log(`Found ${posts.length} posts\n`);

    if (posts.length > 0) {
      console.log('Latest post:', posts[0].title);
    }

    console.log('\n-----------------------------------\n');
    console.log('Testing Admin API with simple post (no tags)...\n');

    const adminApi = new GhostAdminAPI({
      url: process.env.GHOST_API_URL,
      key: process.env.GHOST_ADMIN_API_KEY,
      version: 'v5.0'
    });

    const simplePost = await adminApi.posts.add({
      title: `Simple Test - ${Date.now()}`,
      html: '<p>This is a very simple test post.</p>',
      status: 'draft'
    });

    console.log('✓ Post created successfully!');
    console.log('Title:', simplePost.title);
    console.log('URL:', simplePost.url);
    console.log('ID:', simplePost.id);

  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    if (error.context) {
      console.error('Context:', error.context);
    }
  }
}

testContentAPI();
