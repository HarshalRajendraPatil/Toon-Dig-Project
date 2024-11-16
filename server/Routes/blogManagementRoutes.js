import express from "express";
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getAllBlogs,
  getBlog,
  likeBlog,
  unlikeBlog,
  updateBlog,
} from "../Controllers/blogManagementController.js";
import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js";

const router = express.Router();

// Admin Routes
router.post("/", isLoggedIn, createBlog); // Create a blog (Admin only)
router.put("/:blogId", updateBlog); // Update a blog by slug (Admin only)
router.delete("/:blogId", deleteBlog); // Delete a blog by slug (Admin only)

// Public/Protected Routes
router.get("/", getAllBlogs); // Get all blogs with pagination, filtering, and search
router.get("/:blogId", isLoggedIn, getBlog); // Get a blog by its slug

// User Interaction Routes
router.post("/:blogId/like", isLoggedIn, likeBlog); // Like a blog (Protected route for logged-in users)
router.post("/:blogId/dislike", isLoggedIn, unlikeBlog); // Unlike a blog (Protected route for logged-in users)

// Comment Routes
router.post("/:blogId/comment", isLoggedIn, addComment); // Add a comment to a blog (Protected route for logged-in users)
router.delete("/:blogId/comment/:commentId", isLoggedIn, deleteComment); // Delete a comment (Protected route for logged-in users or admin)

export default router;
