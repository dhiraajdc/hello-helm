require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GhostContentAPI = require('@tryghost/content-api');
const GhostAdminAPI = require('@tryghost/admin-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Ghost Content API (for reading public content)
const contentApi = new GhostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v5.0'
});

// Initialize Ghost Admin API (for managing content)
const adminApi = new GhostAdminAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v5.0'
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Ghost API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await contentApi.posts.browse({
      limit: req.query.limit || 15,
      include: 'tags,authors'
    });
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a single post by slug
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await contentApi.posts.read(
      { slug: req.params.slug },
      { include: 'tags,authors' }
    );
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Post not found'
    });
  }
});

// Get all pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await contentApi.pages.browse({
      limit: req.query.limit || 15
    });
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await contentApi.tags.browse({
      limit: 'all'
    });
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all authors
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await contentApi.authors.browse({
      limit: 'all'
    });
    res.json({
      success: true,
      data: authors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new post (using Admin API)
app.post('/api/posts', async (req, res) => {
  try {
    const { title, html, tags, status } = req.body;

    if (!title || !html) {
      return res.status(400).json({
        success: false,
        error: 'Title and content (html) are required'
      });
    }

    const post = await adminApi.posts.add({
      title,
      html,
      tags,
      status: status || 'draft'
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update a post (using Admin API)
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, html, tags, status } = req.body;

    const post = await adminApi.posts.edit({
      id: req.params.id,
      title,
      html,
      tags,
      status,
      updated_at: new Date().toISOString()
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a post (using Admin API)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await adminApi.posts.delete({
      id: req.params.id
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Ghost API Server running on port ${PORT}`);
  console.log(`Ghost API URL: ${process.env.GHOST_API_URL || 'Not configured'}`);
});
