import { asyncHandler } from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import generateToken from "../libs/token.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";

// TODO: verify Firebase ID token with firebase-admin instead of trusting req.body
const googleAuth = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "name and email are required");
  }

  let user = await User.findOne({email})
  if(!user){
    user = await User.create({name,email})
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(new ApiResponse(200, user));
});


const logout = asyncHandler(async(req,res)=>{
    res.clearCookie("token")
    return res.status(200).json(new ApiResponse(200, null, "Logout successfully!"))
})

export {googleAuth,logout};
