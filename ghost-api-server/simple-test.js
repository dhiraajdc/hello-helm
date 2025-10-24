require('dotenv').config();
const GhostAdminAPI = require('@tryghost/admin-api');

console.log('Testing Ghost Admin API...\n');
console.log('URL:', process.env.GHOST_API_URL);
console.log('Admin Key (first 20 chars):', process.env.GHOST_ADMIN_API_KEY.substring(0, 20) + '...');
console.log('Admin Key format valid:', process.env.GHOST_ADMIN_API_KEY.includes(':'));
console.log('\n-----------------------------------\n');

// Try different API versions
const versions = ['v5.0', 'v4.0', 'v3.0'];

async function testWithVersion(version) {
  console.log(`\nTrying with API version: ${version}`);

  const api = new GhostAdminAPI({
    url: process.env.GHOST_API_URL,
    key: process.env.GHOST_ADMIN_API_KEY,
    version: version
  });

  try {
    // Try the simplest possible post
    const post = await api.posts.add({
      title: `Test Post - ${new Date().toISOString()}`,
      html: '<p>Simple test</p>'
    });

    console.log(`✓ SUCCESS with ${version}!`);
    console.log('Post created:', post.url);
    return true;
  } catch (error) {
    console.log(`✗ Failed with ${version}: ${error.message}`);
    if (error.response && error.response.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

async function runTests() {
  for (const version of versions) {
    const success = await testWithVersion(version);
    if (success) {
      console.log('\n✓ Found working version:', version);
      break;
    }
  }
}

runTests();
