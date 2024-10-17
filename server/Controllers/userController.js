import catchAsync from "../Utils/catchAsync.js";
import User from "../models/UserModel.js";
import CustomError from "../Utils/CustomError.js";
import Anime from "../models/AnimeModel.js";
import { isValidObjectId } from "mongoose";
import cloudinary from "../services/cloudinary.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ status: "success", data: users });
});

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
    req.user.stats.favoritesCount -= 1;
  } else {
    req.user.favorites.push(animeId);
    req.user.stats.favoritesCount += 1;
  }

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
    req.user.stats.watchlistCount -= 1;
  } else {
    req.user.watchlist.push(animeId);
    req.user.stats.watchlistCount += 1;
  }

  const user = await req.user.save();
  res.status(200).json({ status: "success", data: user });
});

export const getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await User.findById(req.user.id).populate("favorites");

  res.status(200).json({ status: "success", data: favorites.favorites });
});

export const getWatchlist = catchAsync(async (req, res, next) => {
  const watchList = await User.findById(req.user.id).populate("watchlist");

  res.status(200).json({ status: "success", data: watchList.watchlist });
});
