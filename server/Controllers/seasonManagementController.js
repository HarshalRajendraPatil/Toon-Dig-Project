import { ObjectId } from "mongodb";
import catchAsync from "../Utils/catchAsync.js";
import Anime from "../models/AnimeModel.js";
import Season from "../models/SeasonModel.js";
import cloudinary from "../services/cloudinary.js";
import CustomError from "../Utils/CustomError.js";

export const addSeason = catchAsync(async (req, res, next) => {
  const { animeId } = req.params;

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists", 404));
  const { number, title, description, releaseDate } = req.body;
  const coverImage = req.files?.coverImage;

  if (!number || !title || !description || !coverImage || !releaseDate)
    return next(new CustomError("Please provide all the information", 400));

  const result = await cloudinary.uploader.upload(
    req.files?.coverImage?.tempFilePath,
    {
      resource_type: "auto",
    }
  );

  const seasonBody = {
    animeId,
    number,
    title,
    description,
    releaseDate,
    "coverImage.url": result.secure_url,
    "coverImage.public_id": result.public_id,
  };

  const season = await Season.create(seasonBody);
  anime.seasons.push(season._id);
  await anime.save();
  res.status(201).json({
    status: "success",
    data: season,
  });
});

export const updateSeason = catchAsync(async (req, res, next) => {
  const { animeId, seasonId } = req.params;
  if (!ObjectId.isValid(animeId)) {
    return next(new CustomError("This anime does not exists", 404));
  }
  if (!ObjectId.isValid(seasonId)) {
    return next(new CustomError("This season does not exists.", 404));
  }

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists.", 404));

  const updatedBody = req.body;

  if (req?.files) {
    const result = await cloudinary.uploader.upload(
      req.files?.coverImage?.tempFilePath,
      {
        resource_type: "auto",
      }
    );

    updatedBody["coverImage.url"] = result.secure_url;
    updatedBody["coverImage.public_id"] = result.public_id;
  }

  const season = await Season.findByIdAndUpdate(seasonId, updatedBody, {
    new: true,
    runValidators: true,
  });
  if (!season) return next(new CustomError("This anime does not exists", 404));

  res.status(200).json({
    status: "success",
    data: season,
  });
});

export const getAllSeasons = catchAsync(async (req, res, next) => {
  const { animeId } = req.params;
  if (!ObjectId.isValid(animeId)) {
    return next(new CustomError("This anime does not exists", 404));
  }

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists.", 404));

  const seasons = await Season.find({ animeId });
  res.status(200).json({
    status: "success",
    data: seasons,
  });
});

export const getSeason = catchAsync(async (req, res, next) => {
  const { animeId, seasonId } = req.params;
  if (!ObjectId.isValid(animeId)) {
    return next(new CustomError("This anime does not exists", 404));
  }
  if (!ObjectId.isValid(seasonId)) {
    return next(new CustomError("This season does not exists.", 404));
  }

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exits.", 404));

  res.status(200).json({
    status: "success",
    data: season,
  });
});

export const deleteSeason = catchAsync(async (req, res, next) => {
  const { animeId, seasonId } = req.params;
  if (!ObjectId.isValid(animeId)) {
    return next(new CustomError("This anime does not exists", 404));
  }
  if (!ObjectId.isValid(seasonId)) {
    return next(new CustomError("This season does not exists.", 404));
  }

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exits.", 404));

  anime.seasons = anime.seasons.filter(
    (id) => id.toString() != season._id.toString()
  );

  await season.deleteOne();
  await anime.save();

  await cloudinary.uploader.destroy(season?.coverImage?.public_id);

  res.status(204).json({
    status: "success",
    data: "",
  });
});
