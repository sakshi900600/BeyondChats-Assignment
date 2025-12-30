import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../services/blogApi';
import BlogCard from '../components/BlogCard';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll();
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <div>
          <h1 className="blog-list-title">📚 Blog Articles</h1>
          <p className="blog-list-subtitle">Explore and read enhanced blog content with AI-powered improvements</p>
        </div>
        <button className="btn-rewrite" >
          ✨Blogs Rewritten by AI
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchBlogs} className="btn-retry">Retry</button>
        </div>
      )}

      {loading && <div className="loading">Loading blogs...</div>}

      {!loading && blogs.length === 0 && (
        <div className="empty-state">
          <p>No blogs found. Start by creating or rewriting some blogs!</p>
        </div>
      )}

      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onClick={() => navigate(`/blog/${blog._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
