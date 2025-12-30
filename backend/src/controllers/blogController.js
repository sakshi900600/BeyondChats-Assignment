// src/controllers/blogController.js
import Blog from "../models/Blog.js";
import { searchWeb, scrapeTopArticles } from "../services/searchService.js";
import { rewriteBlogWithGemini } from "../services/llm.service.js";
import { delay } from "../utils/delay.js";

/* CRUD APIs */

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
};

export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
};

export const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};

export const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
};

export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
};

/* MAIN REWRITE PIPELINE */

export const rewriteOldestBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isUpdated: false }).limit(5);

    for (const blog of blogs) {
      console.log(`🔍 Searching: ${blog.title}`);

      const searchResults = await searchWeb(blog.title);
      if (!searchResults.length) continue;

      console.log("📄 Scraping top articles...");
      const { referenceUrls } = await scrapeTopArticles(searchResults);

      if (!referenceUrls.length) continue;

      console.log("✍️ Rewriting with Gemini...");
      const updatedContent = await rewriteBlogWithGemini(
        blog.originalContent,
        referenceUrls
      );

      blog.updatedContent = updatedContent;
      blog.references = referenceUrls;
      blog.isUpdated = true;
      await blog.save();

      console.log("✅ Blog updated:", blog.title);

      // Free-tier protection
      await delay(35000);
    }

    res.json({ message: "Blogs rewritten successfully (free-tier safe)" });
  } catch (err) {
    console.error("❌ Rewrite failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
