import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi } from '../services/blogApi';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getById(id);
      setBlog(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-detail-loading">Loading blog...</div>;
  }

  if (error) {
    return (
      <div className="blog-detail-error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Blogs
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-error">
        <p>Blog not found.</p>
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <button onClick={() => navigate('/')} className="btn-back-top">
        ← Back to Blogs
      </button>

      <article className="blog-detail-wrapper">
        {/* Original Content Section */}
        <div className="blog-section original">
          <div className="section-header">
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-meta">
              <span className="blog-date">
                📅 {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className={`blog-badge ${blog.isUpdated ? 'updated' : 'pending'}`}>
                {blog.isUpdated ? '✓ Updated Version' : '○ Original'}
              </span>
            </div>
          </div>

          <div className="section-content">
            <h2 className="section-title">Original Content</h2>
            <div className="markdown-content">
              {blog.originalContent}
            </div>
          </div>
        </div>

        {/* Divider */}
        {blog.isUpdated && blog.updatedContent && (
          <>
            <div className="blog-divider">
              <div className="divider-line"></div>
              <span className="divider-text">✨ AI-Enhanced Version</span>
              <div className="divider-line"></div>
            </div>

            {/* Updated Content Section */}
            <div className="blog-section updated">
              <div className="section-header">
                <h2 className="section-title">Updated Content</h2>
                {blog.references && blog.references.length > 0 && (
                  <div className="references-preview">
                    📚 Based on {blog.references.length} reference(s)
                  </div>
                )}
              </div>

              <div className="section-content">
                <div className="markdown-content">
                  {blog.updatedContent}
                </div>

                {blog.references && blog.references.length > 0 && (
                  <div className="references-section">
                    <h3 className="references-title">References:</h3>
                    <ul className="references-list">
                      {blog.references.map((ref, idx) => (
                        <li key={idx}>
                          <a href={ref} target="_blank" rel="noopener noreferrer" className="reference-link">
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!blog.isUpdated && (
          <div className="no-update-message">
            <p>✏️ This blog hasn't been enhanced yet. Run the rewrite process to generate an AI-improved version!</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetail;
