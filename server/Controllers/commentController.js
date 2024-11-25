import Comment from "../models/CommentModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/CustomError.js";

// POST /api/comments/:episodeId
export const createComment = catchAsync(async (req, res, next) => {
  const { episodeId } = req.params;
  const { commentText } = req.body;
  const userId = req.user._id; // Assumed user is authenticated

  if (!commentText)
    return next(new CustomError("Please enter a valid comment.", 400));

  const newComment = await Comment.create({
    episodeId,
    userId,
    commentText,
  });

  await newComment.populate("userId", "username profilePicture");

  req.user.comments.push(newComment._id);
  req.user.stats.totalComments += 1;
  req.user.save();

  res.status(201).json({
    success: true,
    data: newComment,
  });
});

// GET /api/comments/:episodeId
export const getAllCommentsForEpisode = catchAsync(async (req, res, next) => {
  const { episodeId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default values for pagination

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  const comments = await Comment.find({ episodeId })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit)); // Apply pagination

  const totalComments = await Comment.countDocuments({ episodeId }); // Total number of comments

  res.status(200).json({
    success: true,
    data: comments,
    totalComments, // Include total number of comments
    currentPage: page,
    totalPages: Math.ceil(totalComments / limit), // Calculate total pages
  });
});

// PUT /api/comments/:commentId
export const updateComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { commentText } = req.body;
  const userId = req.user._id;

  const comment = await Comment.findOne({ _id: commentId, userId });

  if (!comment)
    return next(new CustomError("Comment not found or unauthorized.", 404));

  comment.commentText = commentText;
  await comment.populate("userId", "username profilePicture");
  await comment.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// DELETE /api/comments/:commentId
export const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findOneAndDelete({ _id: commentId, userId });

  if (!comment)
    return next(new CustomError("Comment not found or unauthorized.", 404));

  req.user.comments = req.user.comments.filter(
    (id) => id.toString() != comment._id.toString()
  );

  if (req.user.stats.totalComments !== 0) req.user.stats.totalComments -= 1;

  const user = await req.user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// GET /api/comments/user/:userId
export const getAllCommentsByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default values for pagination

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  const comments = await Comment.find({ userId })
    .populate("episodeId", "title number")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit)); // Apply pagination

  const totalComments = await Comment.countDocuments({ userId }); // Total number of comments

  res.status(200).json({
    success: true,
    data: comments,
    totalComments, // Include total number of comments
    currentPage: page,
    totalPages: Math.ceil(totalComments / limit), // Calculate total pages
  });
});
