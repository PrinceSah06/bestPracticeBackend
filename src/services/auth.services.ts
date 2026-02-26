import User from "../models/user.model";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { redis } from "bun";

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
    throw new AppError("USER_ALREADY_EXISTS",409);
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
  



 await redis.set(`refresh:${user._id.toString()}`,refreshToken,"EX",7*24*60*60)


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


export async function refreshUserToken (refreshToken: string) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await redis.get(`refresh:${payload.id}`);

  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError("Refresh token mismatch", 401);
  }

  // Rotation
  await redis.del(`refresh:${payload.id}`);

  const newAccessToken = await genrateAccessToken({
    id: payload.id,
    role: payload.role,
  });

  const newRefreshToken = await genrateRefreshToken({
    id: payload.id,
    role: payload.role,
  });

  await redis.set(
    `refresh:${payload.id}`,
    newRefreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}