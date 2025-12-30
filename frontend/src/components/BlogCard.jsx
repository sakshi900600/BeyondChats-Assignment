import React from 'react';
import './BlogCard.css';

const BlogCard = ({ blog, onClick }) => {
  const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="blog-card" onClick={onClick}>
      <div className="blog-card-header">
        <h3 className="blog-card-title">{blog.title}</h3>
        <span className={`blog-status ${blog.isUpdated ? 'updated' : 'pending'}`}>
          {blog.isUpdated ? '✓ Updated' : '○ Pending'}
        </span>
      </div>
      <p className="blog-card-content">
        {truncate(blog.originalContent, 150)}
      </p>
      <div className="blog-card-footer">
        <span className="blog-card-date">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
        <button className="blog-card-btn">Read More →</button>
      </div>
    </div>
  );
};

export default BlogCard;
