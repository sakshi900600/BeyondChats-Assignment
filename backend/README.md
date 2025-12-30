# BeyondChats — Backend

> Backend API for the BeyondChats assignment — Express + MongoDB

## Table of contents
- **Overview**: quick summary
- **Tech Stack**: libraries and tools used
- **Project Structure**: important files
- **Environment**: required env variables
- **Installation**: how to install deps
- **Running the server**: dev / production commands
- **API**: available routes and examples
- **Scraper**: how scraping works
- **Deployment**: Vercel notes
- **Contribute** / **License**

## Overview

This is the backend for the BeyondChats assignment. It provides a small REST API to manage blog entries and a scraper service that collects the 5 oldest blog posts from BeyondChats and stores them in MongoDB.

## Tech Stack

- Node.js (ES modules)
- Express
- MongoDB with Mongoose
- Axios + Cheerio (scraper)
- dotenv for configuration

## Project Structure

- `src/server.js` — app bootstrap and DB connect
- `src/app.js` — express app, middleware and routes
- `src/config/db.js` — mongoose connection helper
- `src/routes/blogRoutes.js` — blog-related routes
- `src/controllers/blogController.js` — route handlers
- `src/models/Blog.js` — Mongoose model for blog documents
- `src/services/scraper.js` — scraping logic (fetches oldest 5 blogs)
- `vercel.json` — Vercel deployment config

## Environment

Create a `.env` file in the `backend` folder with the following values:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/dbname
PORT=5000 # optional, default 5000
```

Ensure you keep credentials secret and do not commit `.env` to git.

## Installation

From the `backend` folder run:

```bash
npm install
```

## Running the server

- Quick start (production-style):

```bash
node src/server.js
```

- Development (recommended): install `nodemon` globally or as a dev dependency and run:

```bash
npx nodemon src/server.js
```

Note: `package.json` currently has no `start` or `dev` scripts. You can add these to make startup easier:

```json
"scripts": {
	"start": "node src/server.js",
	"dev": "nodemon src/server.js"
}
```

## API

Base URL (local): `http://localhost:5000`

- Health check

	- GET `/`
	- Response: `Server is running`

- Blogs

	- GET `/api/blogs` — list all blogs
	- GET `/api/blogs/:id` — get a blog by id
	- POST `/api/blogs` — create a new blog (JSON body)
	- PUT `/api/blogs/:id` — update an existing blog (JSON body)
	- DELETE `/api/blogs/:id` — delete a blog
	- POST `/api/blogs/scrape` — trigger scraper to fetch the 5 oldest blogs



## Data model (Blog)

Fields stored in MongoDB (see `src/models/Blog.js`):

- `title` — String
- `originalContent` — String
- `updatedContent` — String (empty until edited)
- `originalUrl` — String
- `references` — [String]
- `isUpdated` — Boolean

## Scraper

The scraper (`src/services/scraper.js`) navigates BeyondChats blog listing pages from older to newer pages and collects the 5 oldest unique blog URLs. For each URL it scrapes the title and content and creates a `Blog` document if it doesn't already exist.

Trigger scraping via POST `/api/blogs/scrape`. Scraping logs are printed to the server console.

## Deployment (Vercel)

This backend includes a `vercel.json` that points Vercel to `src/server.js`. If you deploy to Vercel ensure you set the `MONGO_URI` in Vercel environment variables.



## 📂 Folder Structure
```text
backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoint definitions
│   ├── services/        # Scraping logic (Cheerio)
│   ├── utils/           # Helper constants
│   ├── app.js           # App configuration
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── package.json
└── README.md