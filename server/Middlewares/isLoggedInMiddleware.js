// Requiring all the important packages
import jwt from "jsonwebtoken";

// Requiring all the external packages and internal files
import User from "../models/UserModel.js";

// Middleware for checking if the user is logged in or not
const isLoggedIn = async (req, res, next) => {
  // Getting the token if it exists
  const token = req.cookies.jwt;

  // Redirecting the user to the login page if no token exists
  if (!token)
    return res.status(400).json({ status: "error", message: "Please login." });

  // Verifying the token if the token exists
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
      return res
        .status(400)
        .json({ status: "false", message: "Please login." });
  });

  const userId = jwt.decode(req.cookies.jwt);

  const user = await User.findById(userId.id);

  req.user = user;
  // Moving on with the next middleware
  next();
};

export default isLoggedIn;
