import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";


import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * GET /api/posts
 * Public: list all posts with pagination
 * HEAVILY INSTRUMENTED FOR PERFORMANCE DEBUGGING
 */
router.get("/", cacheMiddleware(30), async (req, res) => {
  const timings = {
    requestReceived: performance.now(),
    parseQueryParams: 0,
    dbConnectionCheck: 0,
    countQueryStart: 0,
    countQueryEnd: 0,
    findQueryStart: 0,
    findQueryEnd: 0,
    responseReady: 0,
    responseSent: 0
  };

  try {
    console.log('\n========================================');
    console.log('📥 GET /posts - REQUEST RECEIVED');
    console.log('========================================');

    // Step 1: Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    timings.parseQueryParams = performance.now();
    console.log(`⏱️  Parse params: ${Math.round(timings.parseQueryParams - timings.requestReceived)}ms`);

    // Step 2: Check DB connection
    const dbState = mongoose.connection.readyState;
    const dbStateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log(`🗄️  DB Connection State: ${dbState} (${dbStateNames[dbState]})`);
    timings.dbConnectionCheck = performance.now();
    console.log(`⏱️  DB check: ${Math.round(timings.dbConnectionCheck - timings.parseQueryParams)}ms`);

    if (dbState !== 1) {
      console.error('❌ DATABASE NOT CONNECTED!');
      console.error('   This is likely causing the 4-second delay!');
      return res.status(500).json({ message: 'Database connection error' });
    }

    // Step 3: Count query
    console.log('🔍 Starting countDocuments query...');
    timings.countQueryStart = performance.now();
    const totalCount = await Post.countDocuments();
    timings.countQueryEnd = performance.now();
    const countDuration = Math.round(timings.countQueryEnd - timings.countQueryStart);
    console.log(`✅ Count query completed: ${totalCount} posts`);
    console.log(`⏱️  Count query: ${countDuration}ms`);

    if (countDuration > 300) {
      console.warn(`⚠️  WARNING: Count query is SLOW (${countDuration}ms > 300ms)`);
      console.warn('   → Check if indexes exist: db.posts.getIndexes()');
    }

    // Step 4: Find query with populate and sort
    console.log('🔍 Starting find query (with populate and sort)...');
    timings.findQueryStart = performance.now();

    const posts = await Post.find()
      .populate("author", "name email")
      .select("-voters")
      .sort({ votesCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    timings.findQueryEnd = performance.now();
    const findDuration = Math.round(timings.findQueryEnd - timings.findQueryStart);
    console.log(`✅ Find query completed: ${posts.length} posts retrieved`);
    console.log(`⏱️  Find query (with populate & sort): ${findDuration}ms`);

    if (findDuration > 500) {
      console.warn(`⚠️  WARNING: Find query is VERY SLOW (${findDuration}ms > 500ms)`);
      console.warn('   → Check if compound index exists: { votesCount: -1, createdAt: -1 }');
      console.warn('   → Run: db.posts.find().sort({votesCount:-1,createdAt:-1}).explain("executionStats")');
    }

    // Step 5: Prepare response
    timings.responseReady = performance.now();

    const response = {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalPosts: totalCount,
        postsPerPage: limit,
        hasMore: skip + posts.length < totalCount
      }
    };

    // Step 6: Send response
    res.json(response);
    timings.responseSent = performance.now();

    // Final timing report
    const totalTime = timings.responseSent - timings.requestReceived;
    console.log('\n========================================');
    console.log('📊 DETAILED TIMING BREAKDOWN:');
    console.log('========================================');
    console.log(`Parse params:     ${Math.round(timings.parseQueryParams - timings.requestReceived)}ms`);
    console.log(`DB check:         ${Math.round(timings.dbConnectionCheck - timings.parseQueryParams)}ms`);
    console.log(`Count query:      ${Math.round(timings.countQueryEnd - timings.countQueryStart)}ms`);
    console.log(`Find query:       ${Math.round(timings.findQueryEnd - timings.findQueryStart)}ms`);
    console.log(`Prepare response: ${Math.round(timings.responseReady - timings.findQueryEnd)}ms`);
    console.log(`Send response:    ${Math.round(timings.responseSent - timings.responseReady)}ms`);
    console.log('----------------------------------------');
    console.log(`⏱️  TOTAL TIME:     ${Math.round(totalTime)}ms`);
    console.log('========================================\n');

    // Overall warnings
    if (totalTime > 1000) {
      console.warn(`🚨 CRITICAL: Total request time is ${Math.round(totalTime)}ms (target: <200ms)`);
      console.warn('   This explains your 4-second TTFB!');
      console.warn('   Check the breakdown above to see where time is spent.');
    } else if (totalTime > 500) {
      console.warn(`⚠️  WARNING: Request took ${Math.round(totalTime)}ms (target: <200ms)`);
    } else {
      console.log(`✅ GOOD: Request completed in ${Math.round(totalTime)}ms`);
    }

  } catch (err) {
    const errorTime = performance.now() - timings.requestReceived;
    console.error('❌ ERROR in GET /posts:', err);
    console.error(`⏱️  Failed after: ${Math.round(errorTime)}ms`);
    console.error('   Stack trace:', err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
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
    clearCache('/api/posts');
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



// GET /api/posts/:id (Public) - Post details
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch {
    res.status(400).json({ message: "Invalid post id" });
  }
});


// PUT /api/posts/:id (Protected) - Update post (owner only) + optional image replace
router.put(
  "/:id",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Image upload failed: " + (err.message || JSON.stringify(err)),
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

      // ✅ owner check
      if (String(post.author) !== String(req.user._id)) {
        return res.status(403).json({ message: "Forbidden: not the owner" });
      }

      // update fields if provided
      if (title) post.title = title;
      if (content) post.content = content;
      if (category) post.category = category;

      // if new image uploaded => delete old + set new
      if (req.file) {
        if (post.imagePublicId) {
          // cloudinary destroy (ignore errors)
          try {
            await cloudinary.uploader.destroy(post.imagePublicId);
          } catch { }
        }
        post.imageUrl = req.file.path;
        post.imagePublicId = req.file.filename;
      }

      await post.save();

      const populated = await Post.findById(post._id).populate("author", "name email");
      clearCache('/api/posts');
      res.json({ post: populated });
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

    // ✅ owner check
    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }

    // delete image from cloudinary
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
      } catch { }
    }

    await post.deleteOne();
    clearCache('/api/posts');
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

    // Use atomic update to avoid race conditions and bypass full document validation
    // $addToSet ensures user can only vote once
    // $inc increments the vote count
    const post = await Post.findOneAndUpdate(
      { _id: postId, voters: { $ne: userId } },
      {
        $addToSet: { voters: userId },
        $inc: { votesCount: 1 }
      },
      { new: true }
    ).populate("author", "name email");

    if (!post) {
      // Check if post exists at all
      const exists = await Post.findById(postId);
      if (!exists) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(400).json({ message: "You already voted for this post" });
    }

    clearCache('/api/posts');
    res.json({ post });
  } catch (err) {
    console.error('❌ Vote error:', err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;
