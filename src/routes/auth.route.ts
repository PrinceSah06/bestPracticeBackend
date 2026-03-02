import { z} from "zod";
import { Hono } from "hono";
import {  loginUser, loginValidator, refreshUserToken, registerUser } from "../services/auth.services";
import { AppError } from "../utils/AppError";
import { getCookie, setCookie } from "hono/cookie";
import redis from "../config/radis.config";
import { logOutController } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

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





 const  authRoute =  new Hono();

 authRoute.post("/register", async (c) => {

  const body = await c.req.json();
  const parsed = userValidator.safeParse(body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400);
  }
 console.log(`login body ===> : ${parsed.data}`)
 
  const user = await registerUser(parsed.data);

  return c.json({
    message: "User registered successfully",
    user,
  }, 201);
});


authRoute.post("/login", async (c) => {
  const body = await c.req.json();
  console.log('body ==========>',body)

  const parsed = loginValidator.safeParse(body);

  if (!parsed.success) {
    throw new AppError("Invalid input", 400);
  }

  const result = await loginUser(parsed.data);

  const { accessToken,refreshToken,user} = result
console.log("Before redis.set");


  //  await redis.set(`refresh:${user.id.toString()}`,refreshToken,"EX",7*24*60*60)

console.log("After redis.set");

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
});
authRoute.post('/logout',authMiddleware,logOutController)

authRoute.post('/refresh',async (c) => {

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
});


 export default authRoute