import jwt from "jsonwebtoken";

const getTokenAndResponse = (res, user) => {
  // Gives the jwt token by taking the payload as the id of the newly created user and expires in 3 days
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  });

  // Sends the response back to the user with cookie of jwt set to the token, userId set to logged in id of user and expires in 3 days
  res
    .cookie("jwt", token, {
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json({
      status: "success",
      token,
      data: user,
    });
};

export default getTokenAndResponse;
