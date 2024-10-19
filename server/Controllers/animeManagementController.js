import catchAsync from "../Utils/catchAsync.js";
import Anime from "../models/AnimeModel.js";
import { ObjectId } from "mongodb";
import cloudinary from "../services/cloudinary.js";
import CustomError from "../Utils/CustomError.js";

export const addAnime = catchAsync(async (req, res, next) => {
  const { title, description, genres, releaseDate, status } = req.body;

  if (
    !title ||
    !description ||
    !genres ||
    !releaseDate ||
    !status ||
    !req.files.imageUrl
  ) {
    return next(
      new CustomError(
        "Please provide all the necessary information for the anime",
        400
      )
    );
  }

  const result = await cloudinary.uploader.upload(
    req.files?.imageUrl?.tempFilePath,
    {
      resource_type: "auto",
    }
  );
  const arrayGenres = genres.split(", ");

  const animeBody = {
    title,
    description,
    genres: arrayGenres,
    releaseDate,
    status,
    "imageUrl.url": result.secure_url,
    "imageUrl.public_id": result.public_id,
  };

  const anime = await Anime.create(animeBody);
  res.status(201).json({ status: "success", data: anime });
});

export const getAnime = catchAsync(async (req, res, next) => {
  let { animeName } = req.params;
  animeName = animeName.split("-").join(" ");

  const anime = await Anime.findOne({ title: animeName }).populate("seasons");
  if (!anime) return next(new CustomError("This anime does not exists.", 404));

  res.status(200).json({ status: "success", data: anime });
});

export const getAllAnimes = catchAsync(async (req, res) => {
  const {
    search = "",
    genre = "",
    status = "",
    sortBy = "title", // Default sort by title
    sortOrder = "asc", // Default ascending order
    page = 1,
    limit = 10,
  } = req.query;

  // Apply filters based on search query, genre, and status
  const query = {};
  if (search) query.title = { $regex: search, $options: "i" }; // Case-insensitive search
  if (genre) query.genres = genre;
  if (status) query.status = status;

  const skip = (page - 1) * limit; // Calculate the number of documents to skip
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 }; // Dynamic sorting

  try {
    const totalAnimes = await Anime.countDocuments(query);
    const totalPages = Math.ceil(totalAnimes / limit);

    const animes = await Anime.find(query)
      .sort(sortOptions) // Sorting based on provided field and order
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ status: "success", data: animes, totalPages });
  } catch (error) {
    console.error("Error fetching anime:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export const updateAnime = catchAsync(async (req, res, next) => {
  let { animeId } = req.params;
  animeId = animeId.split("-").join(" ");

  const updatedBody = req.body;
  if (updatedBody?.genres) updatedBody.genres = updatedBody.genres.split(", ");
  if (updatedBody?.averageRating) delete updatedBody.averageRating;
  if (updatedBody?.reviewsAndRating) delete updatedBody.reviewsAndRating;

  if (req.files) {
    const result = await cloudinary.uploader.upload(
      req.files?.image?.tempFilePath,
      {
        resource_type: "auto",
      }
    );

    updatedBody["imageUrl.url"] = result.secure_url;
    updatedBody["imageUrl.public_id"] = result.public_id;
  }

  const anime = await Anime.findOneAndUpdate({ title: animeId }, updatedBody, {
    new: true,
    runValidators: true,
  });
  if (!anime) return next(new CustomError("This anime does not exists", 404));

  res.status(200).json({
    status: "success",
    data: anime,
  });
});

export const deleteAnime = catchAsync(async (req, res, next) => {
  const { animeId } = req.params;
  if (!ObjectId.isValid(animeId)) {
    return next(new CustomError("This anime does not exists", 404));
  }

  const anime = await Anime.findById(animeId);
  if (!anime) return next(new CustomError("This anime does not exists", 404));

  await anime.deleteOne();

  await cloudinary.uploader.destroy(anime.imageUrl.public_id);

  res.status(204).json({
    status: "success",
    data: "",
  });
});
