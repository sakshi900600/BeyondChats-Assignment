# 📚 BeyondChats Frontend

A modern, responsive React + Vite frontend application for the BeyondChats blog platform. Features AI-powered blog content enhancement with an intuitive user interface for browsing and reading blog articles.

## ✨ Features

- **📖 Blog List Page**: Browse all blogs in a responsive grid layout with card-based design
- **📝 Blog Detail Page**: Read original and AI-enhanced blog content side-by-side
- **✨ AI Enhancement**: Visual indicators for updated blogs with reference citations
- **📱 Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop screens
- **⚡ Fast Navigation**: Smooth client-side routing with React Router
- **🎨 Modern UI**: Clean, professional design with Tailwind-inspired utility styling

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom responsive styling

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── BlogCard.jsx          # Blog card component
│   │   └── BlogCard.css          # Card styling
│   ├── pages/
│   │   ├── BlogList.jsx          # Blog listing page
│   │   ├── BlogList.css          # Blog list styling
│   │   ├── BlogDetail.jsx        # Blog detail page
│   │   └── BlogDetail.css        # Detail page styling
│   ├── services/
│   │   └── blogApi.js            # API service layer
│   ├── App.jsx                   # Main app router
│   ├── App.css                   # Global styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Base styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Blog List Page (`/`)

- View all blogs in a responsive grid layout
- See blog status (Original/Updated)
- Click "Read More →" or anywhere on the card to view full blog
- Click "✨ Rewrite Blogs" button to trigger AI enhancement process
- Error handling with retry functionality

### Blog Detail Page (`/blog/:id`)

- **Original Content Section**: View the original blog text
- **Divider**: Visual separator between original and enhanced content
- **Updated Content Section**: Read AI-improved blog with:
  - Enhanced structure and formatting
  - Professional formatting with headings and bullet points
  - Reference links to source articles
- **Navigation**: "← Back to Blogs" button to return to list

### Components

#### BlogCard
Displays blog summary in card format with:
- Title truncation (150 chars)
- Status badge (Updated/Pending)
- Publication date
- "Read More" button
- Hover effects and smooth transitions

#### BlogList
Main page showing:
- Grid layout of all blogs
- Rewrite action button
- Loading states
- Error handling with retry
- Empty state messaging

#### BlogDetail
Full blog view with:
- Original content display
- Updated content (if available)
- References section
- Responsive markdown rendering
- Navigation controls

## 🎯 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api/blogs`

### API Endpoints Used

```javascript
GET  /                  // Get all blogs
GET  /:id              // Get specific blog
POST /                 // Create blog
PUT  /:id              // Update blog
DELETE /:id            // Delete blog
POST /rewrite          // Trigger AI rewrite process
POST /scrape           // Scrape new blogs
```

See [blogApi.js](src/services/blogApi.js) for implementation details.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (multi-column grid)
- **Tablet**: 768px - 1199px (2-column layout)
- **Mobile**: < 768px (single column, optimized touch targets)
- **Small Mobile**: < 480px (compact layout)

## 🎨 Design Features

### Color Scheme
- **Primary**: #3b82f6 (Blue) - Links, buttons
- **Success**: #10b981 (Green) - Updated status
- **Warning**: #92400e (Brown) - Pending status
- **Background**: #f9fafb (Light gray)
- **Text**: #1f2937 (Dark gray)



## 🔄 State Management

The app uses React hooks:
- `useState` - Local component state
- `useEffect` - Data fetching on mount
- `useParams` - Route parameters
- `useNavigate` - Client-side navigation


## 📦 Dependencies

```json
{
  "axios": "^1.13.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.11.0",
    "rehype-raw": "^7.0.0",
    "rehype-sanitize": "^6.0.0",
    "remark-gfm": "^4.0.1"
}
```

