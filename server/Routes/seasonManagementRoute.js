import express from "express";
import {
  addSeason,
  deleteSeason,
  getAllSeasons,
  updateSeason,
  getSeason,
} from "../Controllers/seasonManagementController.js";

const router = express.Router();

router.post("/anime/:animeId/season", addSeason);

router.get("/anime/:animeId/season", getAllSeasons);

router.get("/anime/:animeId/season/:seasonId", getSeason);

router.put("/anime/:animeId/season/:seasonId", updateSeason);

router.delete("/anime/:animeId/season/:seasonId", deleteSeason);

export default router;
