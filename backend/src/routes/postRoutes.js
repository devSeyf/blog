import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * GET /api/posts
 *  
 */
router.get("/", async (req, res) => {
  console.log('get startttttttt');

  try {
    console.log('inside try');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    console.log('get pagee');
    const posts = await Post.find()
      .select("title content category imageUrl votesCount author createdAt")
      .sort({ votesCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.log('get post after ');
    console.log('get post after ');
    const totalCount = await Post.countDocuments();
    console.log('start transfrom json ');
    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalPosts: totalCount,
      },

    }

    );
    console.log('after transform json  ');

  }

  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts
 * Protected: create post
 */
router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Upload Error Details:", err);
        return res.status(400).json({
          message:
            "Image upload failed: " + (err.message || "Invalid file type or size"),
        });
      }
      next();
    });
  },
  async (req, res) => {
    const startTime = performance.now();
    try {
      const { title, content, category } = req.body;

      if (!title || !content || !category) {
        return res
          .status(400)
          .json({ message: "Title, content, and category are all required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const post = new Post({
        title,
        content,
        category,
        author: req.user._id,
        imageUrl: req.file.path,
        imagePublicId: req.file.filename,
      });

      await post.save();

      const responseObject = post.toObject();
      responseObject.author = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      };

      const duration = Math.round(performance.now() - startTime);
      console.log(`  POST creation took ${duration}ms`);

      res.status(201).json({ post: responseObject });
    } catch (err) {
      console.error("Post creation error:", err);
      res.status(500).json({ message: err.message || "Server error during post creation" });
    }
  }
);

// GET /api/posts/mine (Protected) - My posts
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

// GET /api/posts/:id (Public) - Post details
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch {
    res.status(400).json({ message: "Invalid post id" });
  }
});

// PUT /api/posts/:id (Protected) - Update post (owner only)
router.put(
  "/:id",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(500).json({
          message:
            "Image upload failed: " + (err.message || JSON.stringify(err)),
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, content, category } = req.body;

      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (String(post.author) !== String(req.user._id)) {
        return res.status(403).json({ message: "Forbidden: not the owner" });
      }

      if (title) post.title = title;
      if (content) post.content = content;
      if (category) post.category = category;

      if (req.file) {
        if (post.imagePublicId) {
          // OPTIMIZATION: Non-blocking Cloudinary deletion
          cloudinary.uploader.destroy(post.imagePublicId).catch(err => {
            console.error("  Cloudinary cleanup error (non-blocking):", err.message);
          });
        }
        post.imageUrl = req.file.path;
        post.imagePublicId = req.file.filename;
      }

      await post.save();

      const responseObject = post.toObject();
      responseObject.author = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      };


      res.json({ post: responseObject });
    } catch (err) {
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
);

// DELETE /api/posts/:id (Protected) - Delete post (owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }

    if (post.imagePublicId) {
      // OPTIMIZATION: Non-blocking Cloudinary deletion
      cloudinary.uploader.destroy(post.imagePublicId).catch(err => {
        console.error("  Cloudinary cleanup error (non-blocking):", err.message);
      });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
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

    const post = await Post.findOneAndUpdate(
      { _id: postId, voters: { $ne: userId } },
      {
        $addToSet: { voters: userId },
        $inc: { votesCount: 1 },
      },
      { new: true }
    ).populate("author", "name email");

    if (!post) {
      const exists = await Post.findById(postId);
      if (!exists) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res
        .status(400)
        .json({ message: "You already voted for this post" });
    }


    res.json({ post });
  } catch (err) {
    console.error("Vote error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
