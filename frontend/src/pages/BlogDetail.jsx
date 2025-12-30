import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
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

  const cleanContent = (text) => {
    if (!text) return '';
    return text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const mdComponents = {
    a: ({ node, ...props }) => <a className="md-link" {...props} />,
    p: ({ node, ...props }) => <p className="md-paragraph" {...props} />,
    li: ({ node, ...props }) => <li className="md-list-item" {...props} />,
    code: ({ node, inline, className, children, ...props }) => {
      return inline ? (
        <code className="md-inline-code">{children}</code>
      ) : (
        <pre className="md-pre">
          <code className={`md-code-block ${className || ''}`}>{children}</code>
        </pre>
      );
    },
    img: ({ node, ...props }) => <img className="md-image" alt={props.alt || ''} {...props} />,
    blockquote: ({ node, ...props }) => <blockquote className="md-blockquote" {...props} />,
    table: ({ node, ...props }) => <table className="md-table" {...props} />,
    thead: ({ node, ...props }) => <thead {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr {...props} />,
    td: ({ node, ...props }) => <td {...props} />,
    th: ({ node, ...props }) => <th {...props} />,
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
        <div className="section-header top">
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
            {blog.originalUrl && (
              <a href={blog.originalUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                🔗 Original Source
              </a>
            )}
          </div>
        </div>

        <div className="columns-wrapper">
          <div className="blog-section original">
            <h2 className="section-title">Original Content</h2>
            <div className="section-content markdown-content">
              <ReactMarkdown
                children={cleanContent(blog.originalContent)}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={mdComponents}
              />
            </div>
          </div>

          <div className="blog-section updated">
            <h2 className="section-title">AI-Enhanced Version</h2>
            <div className="section-content markdown-content">
              {blog.isUpdated && blog.updatedContent ? (
                <ReactMarkdown
                  children={cleanContent(blog.updatedContent)}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={mdComponents}
                />
              ) : (
                <div className="no-update-message">
                  <p>✏️ This blog hasn't been enhanced yet. Run the rewrite process to generate an AI-improved version!</p>
                </div>
              )}

              {blog.references && blog.references.length > 0 && (
                <div className="references-section">
                  <h3 className="references-title">References</h3>
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
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
