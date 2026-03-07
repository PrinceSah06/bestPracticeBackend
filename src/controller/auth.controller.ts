import type { Context } from "hono";
import { logoutformRadis } from "../services/auth.services";
import redis from "../config/radis.config";
import { z} from "zod";
import { getCookie, setCookie } from "hono/cookie";
import {   refreshUserToken,  } from "../services/auth.services";
import { AppError } from "../utils/AppError";
import { registerUser,loginUser,loginValidator } from "../services/auth.services";

 const  userValidator = z.object({
    name:z
    .string()
    .min(2,"Name must be at least 2 characters")
    .max(50)
    ,
    email:z
    .string()
    .email("Invalid email format")

    ,
    password:z
    .string()
    .min(5,'Password must be at least 5 charcters')
    .max(100),
 }) 
const registerController = async(c:Context)=> {

  const body = await c.req.json();
  const parsed = userValidator.safeParse(body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400);
  }
 
  const user = await registerUser(parsed.data);

  return c.json({
    message: "User registered successfully",
    user,
  }, 201);
}
const loginController = async (c:Context) => {
  const body = await c.req.json();

  const parsed = loginValidator.safeParse(body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400);
  }

  const result = await loginUser(parsed.data);

  const { accessToken,refreshToken,user} = result




  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60,
  });
  return c.json(

    {message:"Login successful",
      user:{id:result.user.id,
    name:result.user.name,
    email:result.user.email,
    role:result.user.role},accessToken

  }, 200);
}
const refreshController = async (c:Context) => {

  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }


  const { accessToken, refreshToken: newRefreshToken } =
    await refreshUserToken(refreshToken);

  // Rotate cookie
  setCookie(c, "refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60,
  });

  return c.json({
    accessToken,
  });
}


const logOutController = async (c: Context) => {
  const user = c.get("user") as { id?: string };
  const refreshToken = getCookie(c, "refreshToken");

  if (!user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  if (refreshToken) {
    const storedToken = await redis.get(`refresh:${user.id}`);
    if (storedToken && storedToken !== refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  await logoutformRadis(user.id);

  setCookie(c, "refreshToken", "", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "Strict",
    maxAge: 0,
  });

  return c.json({ message: "logOut succesfully" }, 200);
};


export { logOutController,loginController,refreshController ,registerController};
