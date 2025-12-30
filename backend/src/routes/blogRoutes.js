import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  rewriteOldestBlogs
} from "../controllers/blogController.js";

const router = express.Router();

// Specific routes BEFORE parameterized routes
router.post("/rewrite", rewriteOldestBlogs);
router.get("/", getBlogs);
router.post("/", createBlog);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;