import Blog from "../models/BlogModel.js";
import Anime from "../models/AnimeModel.js";
import CustomError from "../Utils/CustomError.js";
import catchAsync from "../Utils/catchAsync.js";
import cloudinary from "../services/cloudinary.js";

// Create a new blog (Admin only)
export const createBlog = catchAsync(async (req, res, next) => {
  const { title, content, tags, category, relaltedAnime } = req.body;

  if (!title || !content || !tags || !category || !req.files.thumbnailImage)
    return next(new CustomError("Please provide all the data.", 400));

  if (req.files) {
    if (req?.files?.thumbnailImage) {
      var thumbnailImageResult = await cloudinary.uploader.upload(
        req?.files?.thumbnailImage?.tempFilePath,
        {
          resource_type: "auto",
        }
      );
    }

    if (req.files.bannerImage) {
      var coverImageResult = await cloudinary.uploader.upload(
        req?.files?.thumbnailImage?.tempFilePath,
        {
          resource_type: "auto",
        }
      );
    }
  }

  // Create the new blog
  const blog = await Blog.create({
    title,
    content,
    author: req.user._id, // Assuming req.user contains the logged-in admin
    tags,
    category,
    isFeatured: false,
    isPublished: true,
    "thumbnailImage.url": thumbnailImageResult.secure_url,
    "thumbnailImage.public_id": thumbnailImageResult.public_id,
    "bannerImage.url": coverImageResult.secure_url,
    "bannerImage.public_id": coverImageResult.public_id,
  });

  req.user.blogPosts.push(blog._id);
  await req.user.save();

  res.status(201).json({
    success: true,
    data: blog,
  });
});

// Get all blogs (with pagination, sorting, and filtering)
export const getAllBlogs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, category, isFeatured, search } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (isFeatured) filter.isFeatured = isFeatured === "true"; // Convert string to boolean
  if (search) filter.title = new RegExp(search, "i"); // Search by title

  const blogs = await Blog.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("author", "username")
    .populate("relatedAnime", "title coverImage")
    .sort({ createdAt: -1 }); // Sort by latest blogs

  const totalBlogs = await Blog.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: blogs,
    totalBlogs,
    totalPages: Math.ceil(totalBlogs / limit),
    currentPage: page,
  });
});

// Get a single blog by slug
export const getBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId)
    .populate("author", "username profilePicture")
    .populate("relatedAnime", "title coverImage");

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  blog.views += 1; // Increment view count
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// Update blog (Admin only)
export const updateBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const updateData = req.body;

  // Find the blog by ID without directly updating
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  // Update non-image fields from updateData
  Object.keys(updateData).forEach((key) => {
    blog[key] = updateData[key];
  });

  // Handle images if they are provided
  if (req.files) {
    if (req.files.thumbnailImage) {
      // Upload new thumbnail image
      const thumbnailImageResult = await cloudinary.uploader.upload(
        req.files.thumbnailImage.tempFilePath,
        { resource_type: "auto" }
      );

      // Delete old thumbnail image if it exists
      if (blog.thumbnailImage.public_id) {
        await cloudinary.uploader.destroy(blog.thumbnailImage.public_id);
      }

      // Update blog's thumbnail image with the new one
      blog.thumbnailImage.url = thumbnailImageResult.secure_url;
      blog.thumbnailImage.public_id = thumbnailImageResult.public_id;
    }

    if (req.files.bannerImage) {
      // Upload new banner image
      const bannerImageResult = await cloudinary.uploader.upload(
        req.files.bannerImage.tempFilePath,
        { resource_type: "auto" }
      );

      // Delete old banner image if it exists
      if (blog.bannerImage.public_id) {
        await cloudinary.uploader.destroy(blog.bannerImage.public_id);
      }

      // Update blog's banner image with the new one
      blog.bannerImage.url = bannerImageResult.secure_url;
      blog.bannerImage.public_id = bannerImageResult.public_id;
    }
  }

  // Save updated document
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// Delete a blog (Admin only)
export const deleteBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;

  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  console.log(deleteBlog);

  if (!deletedBlog) {
    return next(new CustomError("Blog not found", 404));
  }
  await cloudinary.uploader.destroy(deleteBlog.bannerImage.public_id);
  await cloudinary.uploader.destroy(deleteBlog.thumbnailImage.public_id);

  res.status(204).json({
    success: true,
    data: "",
  });
});

// Like a blog (User action)
export const likeBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  if (blog.likes.includes(req.user._id)) {
    blog.likes = blog.likes.filter(
      (id) => id.toString() !== req?.user?._id?.toString()
    );
  } else {
    blog.likes.push(req.user._id);
  }

  await blog.save();

  res.status(200).json({
    success: true,
    data: blog.likes.length,
  });
});

// Unlike a blog (User action)
export const unlikeBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  if (blog.disLikes.includes(req.user._id)) {
    blog.disLikes = blog.disLikes.filter(
      (id) => id.toString() !== req?.user?._id?.toString()
    );
  } else {
    blog.disLikes.push(req.user._id);
  }

  await blog.save();

  res.status(200).json({
    success: true,
    data: blog.disLikes.length,
  });
});

// Add a comment to the blog (User action)
export const addComment = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const { commentText } = req.body;
  console.log(req.body);

  if (!commentText)
    return next(new CustomError("Please enter a valid comment.", 400));

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  const comment = {
    userId: req?.user?._id,
    commentText,
    createdAt: new Date(),
  };

  blog.comments.push(comment);
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog.comments,
  });
});

// Delete a comment (Admin or the comment's author)
export const deleteComment = catchAsync(async (req, res, next) => {
  const { blogId, commentId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  const comment = blog.comments.id(commentId);

  if (!comment) {
    return next(new CustomError("Comment not found", 404));
  }

  // Allow deletion only if the comment belongs to the user or the user is an admin
  if (
    comment.userId.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    return next(
      new CustomError("You are not authorized to delete this comment", 403)
    );
  }

  blog.comments = blog.comments.filter(
    (comment) => comment._id.toString() !== commentId.toString()
  );
  await blog.save();

  res.status(204).json({
    success: true,
    data: "",
  });
});
