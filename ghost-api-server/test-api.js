require('dotenv').config();
const GhostContentAPI = require('@tryghost/content-api');

// Initialize Ghost Content API
const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v5.0'
});

async function testContentAPI() {
  try {
    console.log('Testing Ghost Content API...\n');
    console.log('Ghost URL:', process.env.GHOST_API_URL);
    console.log('Content API Key:', process.env.GHOST_CONTENT_API_KEY);
    console.log('-----------------------------------\n');

    const posts = await api.posts.browse({limit: 5});

    console.log('✓ Content API is working!\n');
    console.log(`Found ${posts.length} posts:\n`);

    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published_at}`);
      console.log(`   URL: ${post.url}\n`);
    });

    console.log('\n-----------------------------------');
    console.log('\nNow testing Admin API...\n');

    const GhostAdminAPI = require('@tryghost/admin-api');
    const adminApi = new GhostAdminAPI({
      url: process.env.GHOST_API_URL,
      key: process.env.GHOST_ADMIN_API_KEY,
      version: 'v5.0'
    });

    console.log('Admin API Key:', process.env.GHOST_ADMIN_API_KEY);
    console.log('\nAttempting to fetch posts with Admin API...');

    // Try to get posts using admin API
    const adminPosts = await adminApi.posts.browse({limit: 1});
    console.log('✓ Admin API read access is working!');
    console.log('\nAttempting to create a draft post...');

    const testPost = await adminApi.posts.add({
      title: 'Test Post from Node.js',
      html: '<p>This is a test post created via the Ghost Admin API.</p>',
      status: 'draft'
    }, {source: 'html'});

    console.log('✓ Post created successfully!');
    console.log('Post URL:', testPost.url);

  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response && error.response.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nTroubleshooting:');
    console.error('1. Make sure the Admin API key is from a Custom Integration');
    console.error('2. Verify the integration has proper permissions');
    console.error('3. Check that the key format is: ID:SECRET');
  }
}

testContentAPI();
