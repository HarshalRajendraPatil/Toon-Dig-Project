// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js";
import {
  addAnime,
  deleteAnime,
  getAllAnimes,
  getAnime,
  updateAnime,
} from "../Controllers/animeManagementController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for POST request "/register" link
router.post("/anime", addAnime);

router.put("/anime/:animeId", updateAnime);

router.delete("/anime/:animeId", deleteAnime);

router.get("/anime", getAllAnimes);

router.get("/anime/:animeName", getAnime);

// Exporting the router
export default router;
