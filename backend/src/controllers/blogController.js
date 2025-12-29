import Blog from "../models/Blog.js";
import { scrapeOldestBlogs } from "../services/scraper.js";



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
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(blog);
};

export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
};



export const scrapeBlogs = async (req, res) => {
  await scrapeOldestBlogs();
  res.json({ message: "Scraping started" });
};
