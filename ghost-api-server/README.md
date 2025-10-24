# Ghost API Server

A Node.js server application that integrates with the Ghost CMS API, providing both Content API (read operations) and Admin API (write operations) functionality.

## Features

- Read posts, pages, tags, and authors from Ghost
- Create, update, and delete posts via Admin API
- RESTful API endpoints
- CORS enabled
- Environment-based configuration
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- A Ghost CMS instance (self-hosted or Ghost(Pro))
- Ghost Content API Key
- Ghost Admin API Key

## Installation

1. Navigate to the project directory:
```bash
cd ghost-api-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

4. Configure your Ghost API credentials in the `.env` file:
```env
PORT=3000
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your_content_api_key_here
GHOST_ADMIN_API_KEY=your_admin_api_key_here
```

## Getting Your Ghost API Keys

### Content API Key:
1. Log in to your Ghost Admin panel
2. Go to Settings > Integrations
3. Click "Add custom integration"
4. Give it a name and save
5. Copy the Content API Key

### Admin API Key:
1. From the same integration page
2. Copy the Admin API Key (this is a long key with ID and secret)

## Usage

### Start the server:
```bash
npm start
```

### Development mode (with auto-reload):
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /` - Check if server is running

### Content API (Read Operations)

- `GET /api/posts` - Get all posts
  - Query params: `limit` (default: 15)
- `GET /api/posts/:slug` - Get a single post by slug
- `GET /api/pages` - Get all pages
  - Query params: `limit` (default: 15)
- `GET /api/tags` - Get all tags
- `GET /api/authors` - Get all authors

### Admin API (Write Operations)

- `POST /api/posts` - Create a new post
  - Body: `{ title, html, tags, status }`
- `PUT /api/posts/:id` - Update a post
  - Body: `{ title, html, tags, status }`
- `DELETE /api/posts/:id` - Delete a post

## Example Requests

### Get all posts:
```bash
curl http://localhost:3000/api/posts
```

### Get a specific post:
```bash
curl http://localhost:3000/api/posts/my-post-slug
```

### Create a new post:
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "html": "<p>This is the post content</p>",
    "status": "draft"
  }'
```

### Update a post:
```bash
curl -X PUT http://localhost:3000/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "html": "<p>Updated content</p>",
    "status": "published"
  }'
```

### Delete a post:
```bash
curl -X DELETE http://localhost:3000/api/posts/POST_ID
```

## Response Format

All responses follow this format:

### Success:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Dependencies

- `express` - Web framework
- `@tryghost/content-api` - Ghost Content API client
- `@tryghost/admin-api` - Ghost Admin API client
- `dotenv` - Environment variable management
- `cors` - CORS middleware

## Development

The project uses `nodemon` for development, which automatically restarts the server when files change.

## License

MIT

## Contributing

Feel free to open issues or submit pull requests.
