import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/posts
 * Public: list all posts
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts
 * Protected: create post
 */
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, // comes from protect middleware
    });

    const populated = await Post.findById(post._id).populate("author", "name email");

    res.status(201).json({ post: populated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
