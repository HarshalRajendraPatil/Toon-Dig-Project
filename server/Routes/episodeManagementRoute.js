import express from "express";
import {
  addEpisode,
  getAllEpisodes,
  deleteEpisode,
  getEpisode,
  updateEpisode,
} from "../Controllers/episodeManagementController.js";

const router = express.Router();

router.post("/season/:seasonId/episode", addEpisode);

router.get("/season/:seasonId/episode", getAllEpisodes);

router.get("/season/:seasonId/episode/:episodeId", getEpisode);

router.put("/season/:seasonId/episode/:episodeId", updateEpisode);

router.delete("/season/:seasonId/episode/:episodeId", deleteEpisode);

export default router;
