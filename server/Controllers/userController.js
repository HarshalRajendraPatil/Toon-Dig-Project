import catchAsync from "../Utils/catchAsync.js";
import User from "../models/UserModel.js";
import CustomError from "../Utils/CustomError.js";
import Anime from "../models/AnimeModel.js";
import mongoose, { isValidObjectId } from "mongoose";
import cloudinary from "../services/cloudinary.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export const updateUser = catchAsync(async (req, res, next) => {
  const userId = req?.user?.id;
  if (!userId && !isValidObjectId(userId))
    return next(new CustomError("Please log in to perform this action.", 400));

  const updatedBody = req.body;

  if (req.files) {
    const result = await cloudinary.uploader.upload(
      req.files?.profilePicture?.tempFilePath,
      {
        resource_type: "auto",
      }
    );

    updatedBody["profilePicture.url"] = result.secure_url;
    updatedBody["profilePicture.public_id"] = result.public_id;
  }

  const user = await User.findByIdAndUpdate(userId, updatedBody, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(200).json({ status: "success", data: user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  if (!userId || !isValidObjectId(userId))
    return next(new CustomError("Please log in to perform this action.", 400));

  const user = await User.findByIdAndDelete(userId);
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(204).json({ status: "success", data: "" });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId))
    return next(new CustomError("Please log in to perform this action.", 400));

  const user = await User.findById(userId);
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(200).json({ status: "success", data: user });
});

export const addToFovorites = catchAsync(async (req, res, next) => {
  const { animeId } = req.body;
  if (!animeId || !isValidObjectId(animeId))
    return next(new CustomError("This is not a valid anime.", 400));

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("Anime not found.", 404));

  if (req.user.favorites.includes(animeId)) {
    req.user.favorites = req.user.favorites.filter(
      (id) => id.toString() !== animeId.toString()
    );
  } else {
    req.user.favorites.push(animeId);
  }

  req.user.stats.favoritesCount = req.user.favorites.length;

  const user = await req.user.save();
  res.status(200).json({ status: "success", data: user });
});

export const addToWatchlist = catchAsync(async (req, res, next) => {
  const { animeId } = req.body;
  if (!animeId || !isValidObjectId(animeId))
    return next(new CustomError("This is not a valid anime.", 400));

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("Anime not found.", 404));

  if (req.user.watchlist.includes(animeId)) {
    req.user.watchlist = req.user.watchlist.filter(
      (id) => id.toString() !== animeId.toString()
    );
  } else {
    req.user.watchlist.push(animeId);
  }

  req.user.stats.watchlistCount = req.user.watchlist.length;

  const user = await req.user.save();
  res.status(200).json({ status: "success", data: user });
});

export const getFavorites = catchAsync(async (req, res, next) => {
  let id = req.query.id;

  const favorites = await User.findById(id ? id : req.user.id).populate(
    "favorites"
  );

  res.status(200).json({ status: "success", data: favorites.favorites });
});

export const getWatchlist = catchAsync(async (req, res, next) => {
  let id = req.query.id;

  const watchList = await User.findById(id ? id : req.user.id).populate(
    "watchlist"
  );

  res.status(200).json({ status: "success", data: watchList.watchlist });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { password, currentPassword } = req.body;

  if (!password || password.trim().length < 8 || !currentPassword)
    return next(new CustomError("Please enter a valid password", 400));

  const user = await User.findOne({ _id: req?.user?._id });
  if (!user) return next(new CustomError("User not authorized.", 400));

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch)
    return next(new CustomError("Incorrect current password.", 400));

  req.user.password = password;
  const newUser = await req.user.save();

  res.status(200).json({
    status: "success",
    data: newUser,
  });
});

export const followUser = catchAsync(async (req, res, next) => {
  const { otherUserId } = req.params;
  const loggedInUserId = req.user._id;

  const otherUser = await User.findById(otherUserId);
  if (!otherUser)
    return next(new CustomError("This user does not exists", 404));

  if (otherUser.followers.includes(new ObjectId(loggedInUserId))) {
    otherUser.followers = otherUser.followers.filter(
      (id) => id.toString() != loggedInUserId.toString()
    );

    req.user.following = req.user.following.filter(
      (id) => id.toString() != otherUserId.toString()
    );
  } else {
    req.user.following.push(otherUserId);
    otherUser.followers.push(loggedInUserId);
  }

  const user = await req.user.save();
  await otherUser.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const getFollowersList = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("followers");

  if (!user) return next(new CustomError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: user.followers,
  });
});

export const getFollowingsList = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("following");

  if (!user) return next(new CustomError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: user.following,
  });
});

export const searchUsers = catchAsync(async (req, res) => {
  const {
    username,
    email,
    role,
    isAdmin,
    bio,
    followersCountMin,
    followersCountMax,
    sortBy = "createdAt", // Default sorting field
    sortOrder = "desc", // Default sort order
    page = 1,
    limit = 10,
  } = req.query;

  // Pagination
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  // Base query
  const query = {};

  // Text search for username
  if (username) {
    query.username = { $regex: username, $options: "i" }; // Case-insensitive regex
  }

  // Exact match for email
  if (email) {
    query.email = email;
  }

  // Filtering by role
  if (role) {
    query.role = role;
  }

  // Admin filter
  if (isAdmin !== undefined) {
    query.isAdmin = isAdmin === "true";
  }

  // Bio search
  if (bio) {
    query.bio = { $regex: bio, $options: "i" }; // Case-insensitive regex
  }

  // Filter by followers count range
  if (followersCountMin || followersCountMax) {
    query["followers"] = {
      ...(followersCountMin ? { $gte: parseInt(followersCountMin, 10) } : {}),
      ...(followersCountMax ? { $lte: parseInt(followersCountMax, 10) } : {}),
    };
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute the query with pagination
  const users = await User.find(query)
    .select("-password") // Exclude sensitive fields
    .populate("followers", "username") // Populate follower details
    .populate("following", "username") // Populate following details
    .sort(sortOptions)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  // Total count for pagination
  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total: totalUsers,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(totalUsers / pageSize),
    },
  });
});
