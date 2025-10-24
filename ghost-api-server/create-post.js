require('dotenv').config();
const GhostAdminAPI = require('@tryghost/admin-api');

// Initialize Ghost Admin API
const api = new GhostAdminAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v5.0'
});

// Sample post data
const samplePost = {
  title: 'Welcome to Ghost API Integration',
  html: `
    <h2>Getting Started with Ghost API</h2>
    <p>This is a sample post created programmatically using the Ghost Admin API and Node.js!</p>

    <h3>What You Can Do</h3>
    <ul>
      <li>Create posts automatically</li>
      <li>Update existing content</li>
      <li>Manage your Ghost site programmatically</li>
      <li>Build custom integrations</li>
    </ul>

    <h3>Features</h3>
    <p>With the Ghost API, you can:</p>
    <ol>
      <li><strong>Content Management</strong> - Create, read, update, and delete posts</li>
      <li><strong>Automation</strong> - Schedule posts and automate publishing workflows</li>
      <li><strong>Integration</strong> - Connect Ghost with other services and tools</li>
      <li><strong>Custom Apps</strong> - Build custom applications on top of Ghost</li>
    </ol>

    <blockquote>
      <p>"Ghost is a powerful open source headless Node.js CMS for professional publishing."</p>
    </blockquote>

    <h3>Next Steps</h3>
    <p>Try exploring the Ghost Admin API to see what else you can build. The possibilities are endless!</p>

    <p><em>This post was created on ${new Date().toLocaleString()}</em></p>
  `,
  tags: [
    {name: 'Getting Started'},
    {name: 'API'},
    {name: 'Tutorial'}
  ],
  status: 'draft',
  featured: false,
  meta_title: 'Welcome to Ghost API Integration',
  meta_description: 'Learn how to create posts programmatically using the Ghost Admin API with Node.js'
};

// Create the post
async function createPost() {
  try {
    console.log('Creating new Ghost post...\n');
    console.log('Post Title:', samplePost.title);
    console.log('Status:', samplePost.status);
    console.log('Featured:', samplePost.featured);
    console.log('Tags:', samplePost.tags.map(t => t.name).join(', '));
    console.log('\nConnecting to:', process.env.GHOST_API_URL);
    console.log('-----------------------------------\n');

    const post = await api.posts.add(samplePost, {source: 'html'});

    console.log('✓ Post created successfully!\n');
    console.log('Post Details:');
    console.log('- ID:', post.id);
    console.log('- Slug:', post.slug);
    console.log('- URL:', post.url);
    console.log('- Published:', post.published_at);
    console.log('\nYou can view your post at:', post.url);

  } catch (error) {
    console.error('✗ Error creating post:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

createPost();
