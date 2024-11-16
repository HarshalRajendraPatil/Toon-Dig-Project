import express from "express";
import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  addToWatchlist,
  addToFovorites,
  getFavorites,
  getWatchlist,
  changePassword,
} from "../Controllers/userController.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getAllUsers);

router.post("/favorites", addToFovorites);

router.get("/favorites", getFavorites);

router.post("/watchlist", addToWatchlist);

router.get("/watchlist", getWatchlist);

router.get("/:userId", getUser);

router.put("/", updateUser);

router.delete("/", deleteUser);

router.put("/change-password", changePassword);

export default router;
