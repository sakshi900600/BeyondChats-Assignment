// src/routes/blogRoutes.js
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

router.get("/", getBlogs);
router.get("/rewrite", rewriteOldestBlogs);
router.post("/", createBlog);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
