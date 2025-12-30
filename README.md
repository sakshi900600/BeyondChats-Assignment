# 🚀 BeyondChats - AI-Powered Blog Enhancement Platform

A full-stack web application that leverages AI to enhance and improve blog content. This project demonstrates a complete workflow of web scraping, content enhancement using Gemini AI, and a responsive UI for managing and viewing blogs.

**Assignment**: BeyondChats Full Stack Web Developer Internship 
**Live Link**: https://beyond-chats-assignment-sigma.vercel.app/

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## 🎯 Project Overview

BeyondChats is a sophisticated blog management platform that:

1. **Stores Original Content**: Manages blog articles in MongoDB
2. **Enhances Content**: Uses DeepSeek AI to rewrite and improve blog quality
3. **Web Scraping**: Searches for reference materials to support content enhancement
4. **Responsive UI**: Modern React frontend for browsing and reading enhanced blogs

### Key Workflows

```
Blog Creation
    ↓
Search & Scrape References (DuckDuckGo + Cheerio)
    ↓
AI Enhancement (Gemini API)
    ↓
Save Updated Content & References
    ↓
Display in Responsive UI
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Atlas)
- **AI Provider**: Gemini API (Chat Completion)
- **Web Scraping**: Cheerio 1.1.2, Axios 1.13.2
- **Search**: DuckDuckGo HTML Search
- **Environment**: Dotenv 17.2.3
- **CORS**: Express CORS 2.8.5

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 6.x
- **HTTP Client**: Axios 1.13.2
- **Styling**: CSS3 (custom, responsive)


---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │   Pages                                    │     │
│  │  - Blog List (Grid)                        │     │
│  │  - Blog Detail (Original + Updated)        │     │
│  └────────────────────────────────────────────┘     │
│                      ↓ Axios API                    │
└─────────────────────────────────────────────────────┘
                       ↓ HTTP
┌───────────────────────────────────────────────────┐
│           Backend (Express.js + Node.js)          │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │   Routes (/api/blogs)                      │   │
│  │  - GET / (list all)                        │   │
│  │  - GET /:id (get one)                      │   │
│  │  - POST / (create)                         │   │
│  │  - PUT /:id (update)                       │   │
│  │  - DELETE /:id (delete)                    │   │
│  │  - POST /rewrite (AI enhancement)          │   │
│  │  - POST /scrape (web scraping)             │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │   Controllers                              │   │
│  │  - Blog CRUD operations                    │   │
│  │  - Rewrite pipeline                        │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │   Services                                 │   │
│  │  - Search (DuckDuckGo)                     │   │
│  │  - Scrape (Cheerio)                        │   │
│  │  - LLM (DeepSeek API)                      │   │
│  └────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘
                       ↓ Mongoose
┌─────────────────────────────────────────────────────┐
│          MongoDB Atlas (Cloud Database)             │
│                                                     │
│  Collections:                                       │
│  - blogs { title, originalContent, updatedContent,  │
│           references, isUpdated, createdAt }        │
└─────────────────────────────────────────────────────┘
                       ↓ HTTP
┌─────────────────────────────────────────────────────┐
│            External APIs                            │
│  - DeepSeek: AI Content Enhancement                 │
│  - DuckDuckGo: Web Search                           │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Backend Features
✅ CRUD operations for blogs
✅ AI-powered content rewriting using DeepSeek
✅ Automatic web scraping for references
✅ Search functionality with DuckDuckGo
✅ MongoDB persistence
✅ Error handling and logging
✅ CORS support

### Frontend Features
✅ Responsive blog grid layout
✅ Blog detail page with original & enhanced content
✅ Status badges (Original/Updated)
✅ Reference links display
✅ Rewrite action button
✅ Loading states
✅ Error handling
✅ Mobile-first responsive design
✅ Smooth page transitions

---

## 📁 Project Structure

```
BeyondChats-Assignment/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup
│   │   ├── server.js                 # Server entry point
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   └── blogController.js     # Blog CRUD + rewrite logic
│   │   ├── models/
│   │   │   └── Blog.js               # Blog schema
│   │   ├── routes/
│   │   │   └── blogRoutes.js         # API routes
│   │   ├── services/
│   │   │   ├── searchService.js      # DuckDuckGo search & scrape
│   │   │   ├── llm.service.js        # DeepSeek API integration
│   │   │   └── scraper.js            # Web scraping utility
│   │   └── utils/
│   │       ├── delay.js              # Utility functions
│   │       └── constants.js          # Constants
│   ├── .env                          # Environment variables
│   ├── package.json                  # Dependencies
│   └── README.md                     # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogCard.jsx          # Blog card component
│   │   │   └── BlogCard.css          # Card styling
│   │   ├── pages/
│   │   │   ├── BlogList.jsx          # List page
│   │   │   ├── BlogList.css          # List styling
│   │   │   ├── BlogDetail.jsx        # Detail page
│   │   │   └── BlogDetail.css        # Detail styling
│   │   ├── services/
│   │   │   └── blogApi.js            # API client
│   │   ├── App.jsx                   # Router setup
│   │   ├── App.css                   # Global styles
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Base styles
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies
│   ├── vite.config.js               # Vite config
│   └── README.md                     # Frontend docs
│
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm/yarn
- MongoDB Atlas account (free tier available)
- DeepSeek API key (https://platform.deepseek.com)

### Clone Repository

```bash
git clone <repo-url>
cd BeyondChats-Assignment
```

### Run Both Services

#### Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm install
node src/server.js
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```


---

## 📦 Backend Setup

### Installation

```bash
cd backend
npm install
```

### Environment Configuration

Create `.env` file:

```dotenv
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# AI API
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

### Start Backend

```bash
node src/server.js
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Backend Dependencies

```json
{
  "axios": "^1.13.2",
  "cheerio": "^1.1.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "mongoose": "^9.0.2"
}
```

---

## 🎨 Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

Open browser: `http://localhost:5173`


### Frontend Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x.x",
  "axios": "^1.13.2"
}
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api/blogs
```

### Endpoints

#### Get All Blogs
```http
GET /
```
**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Blog Title",
    "originalContent": "Original blog text...",
    "updatedContent": "Enhanced blog text...",
    "references": ["https://...", "https://..."],
    "isUpdated": true,
    "createdAt": "2024-12-30T12:00:00Z"
  }
]
```

#### Get Single Blog
```http
GET /:id
```

#### Create Blog
```http
POST /
Content-Type: application/json

{
  "title": "New Blog",
  "originalContent": "Blog content here..."
}
```

#### Update Blog
```http
PUT /:id
Content-Type: application/json

{
  "title": "Updated Title",
  "originalContent": "Updated content..."
}
```

#### Delete Blog
```http
DELETE /:id
```

#### Trigger AI Rewrite
```http
POST /rewrite
```
**Process:**
1. Fetches up to 5 blogs with `isUpdated: false`
2. Searches for references using DuckDuckGo
3. Scrapes top articles (Cheerio)
4. Sends to DeepSeek for enhancement
5. Saves results with references

#### Scrape Blogs
```http
POST /scrape
```

---

## 📊 Database Schema

### Blog Model

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true
  },
  originalContent: {
    type: String,
    required: true
  },
  updatedContent: {
    type: String,
    default: null
  },
  references: [
    {
      type: String  // URLs
    }
  ],
  isUpdated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Mobile Optimizations
- Touch-friendly buttons (min 48px)
- Single column layouts on mobile
- Large readable fonts (16px+)
- Optimized images
- Minimal horizontal scrolling



