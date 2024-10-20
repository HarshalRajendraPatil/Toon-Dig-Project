import express from "express";
import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js";
import {
  createComment,
  deleteComment,
  getAllCommentsByUser,
  getAllCommentsForEpisode,
  updateComment,
} from "../Controllers/commentController.js";

const router = express.Router();

router.use(isLoggedIn);

router.post("/:episodeId", createComment);

router.get("/:episodeId", getAllCommentsForEpisode);

router.put("/:commentId", updateComment);

router.delete("/:commentId", deleteComment);

router.get("/user/:userId", getAllCommentsByUser);

export default router;
