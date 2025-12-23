import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/**
 * GET /api/posts
 * Public: list all posts
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ votesCount: -1, createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts
 * Protected: create post 
 */
router.post("/", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload Error Details:", err);
      return res.status(500).json({
        message: "Image upload failed: " + (err.message || JSON.stringify(err))
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "title, content, category are required" });
    }

   //  if (!req.file) {
   //    return res.status(400).json({ message: "image is required" });
   //  }

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
      imageUrl: req.file?.path || null,      // Cloudinary URL
      imagePublicId: req.file?.filename || null, // Cloudinary public_id
    });

    const populated = await Post.findById(post._id).populate("author", "name email");
    res.status(201).json({ post: populated });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});


// GET /api/posts/mine  (Protected) - My posts
router.get("/mine", protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/posts/voted (Protected) - Posts I voted for
router.get("/voted", protect, async (req, res) => {
  try {
    const posts = await Post.find({ voters: req.user._id })
      .populate("author", "name email")
      .sort({ updatedAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});






/**
 * POST /api/posts/:id/vote
 * Protected: vote for a post (one vote per user)
 */
router.post("/:id/vote", protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // no two vote
    const alreadyVoted = post.voters.some((v) => v.toString() === userId.toString());
    if (alreadyVoted) {
      return res.status(400).json({ message: "You already voted for this post" });
    }

    post.voters.push(userId);
    post.votesCount += 1;

    await post.save();

    const populated = await Post.findById(post._id).populate("author", "name email");
    res.json({ post: populated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
