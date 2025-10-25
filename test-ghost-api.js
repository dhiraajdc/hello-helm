/**
 * Test script to verify Ghost API connection
 */

require('dotenv').config();
const https = require('https');
const url = require('url');

// Load Ghost credentials from environment
const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_CONTENT_KEY = process.env.GHOST_CONTENT_KEY;

console.log('===== Ghost API Connection Test =====\n');
console.log('API URL:', GHOST_API_URL);
console.log('Content Key:', GHOST_CONTENT_KEY ? '***' + GHOST_CONTENT_KEY.slice(-4) : 'NOT SET');
console.log('\n');

if (!GHOST_API_URL || !GHOST_CONTENT_KEY) {
  console.error('ERROR: Missing Ghost API credentials in .env file');
  process.exit(1);
}

// Test the Ghost Content API
const apiUrl = `${GHOST_API_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_KEY}&limit=5`;

console.log('Testing Ghost Content API...');
console.log('Fetching recent posts...\n');

const parsedUrl = url.parse(apiUrl);
const options = {
  hostname: parsedUrl.hostname,
  path: parsedUrl.path,
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Ghost-API-Test/1.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  console.log('Response Status:', res.statusCode);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n');

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200) {
        console.log('✅ SUCCESS! Ghost API connection working.');
        console.log('\n===== API Response =====\n');
        console.log(JSON.stringify(response, null, 2));

        if (response.posts && response.posts.length > 0) {
          console.log('\n===== Posts Summary =====');
          console.log(`Found ${response.posts.length} post(s):\n`);
          response.posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`);
            console.log(`   Slug: ${post.slug}`);
            console.log(`   Published: ${post.published_at || 'Draft'}`);
            console.log('');
          });
        } else {
          console.log('\nNo posts found in the Ghost blog.');
        }
      } else {
        console.log('❌ ERROR: API request failed');
        console.log('Response:', JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.log('❌ ERROR: Failed to parse response');
      console.log('Raw response:', data);
      console.log('Parse error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ ERROR: Request failed');
  console.log('Error:', error.message);
  process.exit(1);
});

req.end();
