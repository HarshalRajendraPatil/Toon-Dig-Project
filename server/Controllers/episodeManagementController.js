import { ObjectId } from "mongodb";
import Season from "../models/SeasonModel.js";
import Episode from "../models/EpisodeModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/CustomError.js";

export const addEpisode = catchAsync(async (req, res, next) => {
  const { seasonId } = req.params;
  if (!ObjectId.isValid(seasonId))
    return next(new CustomError("This season does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season)
    return next(new CustomError("This season does not exists.", 404));

  const {
    number,
    title,
    description,
    videoUrl,
    thumbnailUrl,
    duration,
    airDate,
  } = req.body;
  if (
    !number ||
    !title ||
    !description ||
    !videoUrl ||
    !thumbnailUrl ||
    !duration ||
    !airDate
  ) {
    console.log(number);
    console.log(title);
    console.log(description);
    console.log(videoUrl);
    console.log(thumbnailUrl);
    console.log(duration);
    console.log(airDate);
    return next(new CustomError("Please provide all the information.", 400));
  }

  const episodeBody = {
    seasonId,
    number,
    title,
    description,
    videoUrl,
    thumbnailUrl,
    duration,
    airDate,
  };

  const episode = await Episode.create(episodeBody);

  season.episodes.push(episode._id);
  await season.save();

  res.status(201).json({
    status: "success",
    data: episode,
  });
});

// Get All Episode
export const getAllEpisodes = catchAsync(async (req, res, next) => {
  const { seasonId } = req.params;

  if (!ObjectId.isValid(seasonId))
    return next(new CustomError("This season does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exists", 404));

  const episodes = await Episode.find({ seasonId });

  res.status(200).json({ status: "success", data: episodes });
});

// Get Single Episode
export const getEpisode = catchAsync(async (req, res) => {
  const { episodeId, seasonId } = req.params;

  if (!ObjectId.isValid(seasonId))
    return next(new CustomError("This season does not exists.", 404));
  if (!ObjectId.isValid(episodeId))
    return next(new CustomError("This episode does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exists", 404));

  const episode = await Episode.findById(episodeId);
  if (!episode)
    return next(new CustomError("This episode does not exists.", 404));

  res.status(200).json({ status: "success", data: episode });
});

// Update Episode
export const updateEpisode = catchAsync(async (req, res) => {
  const { episodeId, seasonId } = req.params;

  if (!ObjectId.isValid(seasonId))
    return next(new CustomError("This season does not exists.", 404));
  if (!ObjectId.isValid(episodeId))
    return next(new CustomError("This episode does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exists", 404));

  const episode = await Episode.findByIdAndUpdate(episodeId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!episode)
    return next(new CustomError("This episode does not exists.", 404));

  res.status(200).json({ status: "success", data: episode });
});

export const deleteEpisode = catchAsync(async (req, res, next) => {
  const { episodeId, seasonId } = req.params;

  if (!ObjectId.isValid(seasonId))
    return next(new CustomError("This season does not exists.", 404));
  if (!ObjectId.isValid(episodeId))
    return next(new CustomError("This episode does not exists.", 404));

  const season = await Season.findById(seasonId);
  if (!season) return next(new CustomError("This season does not exists", 404));

  const episode = await Episode.findByIdAndDelete(episodeId);
  if (!episode)
    return next(new CustomError("This episode does not exists.", 404));

  season.episodes = season.episodes.filter(
    (id) => id.toString() != episode._id.toString()
  );

  await season.save();

  res.status(204).json({ status: "success", data: "" });
});
