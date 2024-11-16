import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the Admin model
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnailImage: {
      url: String,
      public_id: String,
    },
    bannerImage: {
      url: String,
      public_id: String,
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      enum: ["News", "Reviews", "Features", "Updates", "Opinion"],
    },
    relatedAnime: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime", // Refers to the Anime model
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false, // If true, the blog will be featured on the homepage or a special section
    },
    isPublished: {
      type: Boolean,
      default: true, // Determines if the blog is visible to users
    },
    views: {
      type: Number,
      default: 0, // Tracks the number of views
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the blog
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the blog
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Users can comment on the blog
        },
        commentText: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
