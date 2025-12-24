import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    votesCount: {
      type: Number,
      default: 0,
    },

    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      
    ],
      category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      imagePublicId: {
        type: String,
        required: true,
      },

  },
  { timestamps: true }
);


postSchema.index({ votesCount: -1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
