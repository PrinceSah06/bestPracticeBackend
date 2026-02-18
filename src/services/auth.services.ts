import User from "../models/user.model";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from "../utils/jwt";

interface user {
  name: string;
  email: string;
  password: string;
}
export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export interface LoginInput {
  email: string;
  password: string;
}
export async function registerUser(data: user) {
  const { name, email, password } = data;

  const isExist = await User.exists({ email });
  const adminExists = await User.exists({ role: "ADMIN" });

let role = "USER";

if (!adminExists) {
  role = "ADMIN";
}


  if (isExist) {
    throw new Error("USER_ALREADY_EXISTS");
  }


  const newUser = new User({ name, email, password,role });
  const user = await newUser.save();

  return { _id: user._id, email: user.email, name: user.name, role: user.role };
}



export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = await genrateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  const refreshToken = await genrateRefreshToken({
    id: user._id.toString(),
    role: user.role,
  });

  user.refreshToken.push({ token: refreshToken })




 
  await user.save();

  return {
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}


export async function refreshUserToken(refreshToken:string){

 let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401);
  }
const user = await User.findById(payload.id);

if (!user) {
  throw new AppError("User not found", 401);
}

const tokenExists = user.refreshToken.some(
  (t) => t.token === refreshToken
);

if (!tokenExists) {
  throw new AppError("Refresh token mismatch", 401);
}



  const newAccessToken =  await genrateAccessToken({
    id:payload.id,
role:payload.role  })


  const newRefreshToken =  await genrateRefreshToken({
    id:payload.id,
role:payload.role  })


  user.refreshToken=user.refreshToken.filter(  (t) => t.token !== refreshToken
);

user.refreshToken.push({ token: newRefreshToken });
if (user.refreshToken.length > 5) {
  user.refreshToken.shift();
}
 await user.save()


   return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
 

}


