// Requiring all the important packages
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

// Requiring all the important modules
import CustomError from "../Utils/CustomError.js";
import User from "../models/UserModel.js";
import getTokenAndResponse from "../Utils/generateTokenAndResponse.js";
import catchAsync from "../Utils/catchAsync.js";
import sendMail from "../services/sendMail.js";
import { ObjectId } from "mongodb";

// Exporting the function for posting to the registration page
const register = catchAsync(async (req, res, next) => {
  // Checking if the email, password and username is entered or not
  const { username, email, password } = req.body;
  if (!email || !password || !username)
    return next(
      new CustomError("Please fill out all the fields correctly", 400)
    );

  // Checking if the email or username entered is already registered
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    if (user.email == email)
      return next(new CustomError("Email already in use. Please login.", 400));
    else
      return next(
        new CustomError("Username already in use. Try another.", 400)
      );
  }

  // Creating the user based on the data entered
  const createdUser = await User.create(req.body);

  getTokenAndResponse(res, createdUser);
});

// Exporting the function for posting to the login page
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if the email and password is entered or not
  if (!email || !password)
    return next(new CustomError("Please enter you email and password", 400));

  // Finding the existing user with the entered email or username
  const user = await User.findOne({ email });

  // Error handling if entered email or username is incorrect
  if (!user)
    return next(new CustomError("Incorrect credentials. Try again", 400));

  // Error handling if entered password is incorrect
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched)
    return next(new CustomError("Incorrect credentials. Try again.", 400));

  getTokenAndResponse(res, user);
});

// Exporting the function for posting to the forgot password page
const forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  // Checking if the email is entered or not
  if (!email)
    return next(new CustomError("Please enter your registered Email.", 400));

  // Getting the user from the database with entered database
  const userData = await User.findOne({ email });

  // Handling error if the user is not found with entered email
  if (!userData)
    return next(
      new CustomError("This email does not exists. Please Register.", 400)
    );

  // Generating a random token with characters
  const token = userData._id;

  // Calling the function to send the reset-password mail and returnt the response
  const subject = "Some Heading";
  const message = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  sendMail(userData.email, next, message, subject);

  // Sending the response back to the user
  res.status(200).json({
    status: "success",
    data: `A link to reset you password has been send to ${email}.`,
    // token,
  });
});

// Exporting the function for posting to the forgot password page
const resetPassword = catchAsync(async (req, res, next) => {
  // Getting the value of password from the user
  const newPass = req.body.password;
  const token = req.body.token;

  // Checking if the password is entered or not
  if (!newPass)
    return next(new CustomError("Please enter the new password", 400));

  // Checking for the token
  if (!token || !ObjectId.isValid(token))
    return next(new CustomError("Invalid token. Try again.", 400));

  const user = await User.findById(token);

  if (!(token == user?._id))
    return next(new CustomError("Invalid token. Try again", 400));

  // Hashing the password
  const hashedPass = await bcrypt.hash(newPass, 10);

  // Updating the user with the new password and returning the new doc.

  await user.updateOne(
    { password: hashedPass },
    { new: true, runValidators: true }
  );

  // Sending the response to the user with the updated user
  res.status(200).json({
    status: "success",
    data: "Your password has been reset successfully",
    data: user,
  });
});

// Exporting the function for getting the reset password page
const logout = (req, res, next) => {
  res
    .cookie("jwt", "", { maxAge: 0, secure: true, sameSite: "None" })
    .json({ status: "success", message: "User logged out" });
};

export { register, login, forgotPassword, resetPassword, logout };
