import type { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export const authMiddleware = async (c: Context, next: Next) => {
  console.log('==========authmidlware clicked=========')
  const authHeader = c.req.header("Authorization");


  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError("header is missing", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return c.json({
      message: "token is missing",
    },401);
  }

  if (!env) {
    return c.json({
      message: "env Missig",
    },501);
  }

  try {
    if (!env.JWT_ACCESS_SECRET) {
      return c.json({ message: "Server configuration error" }, 500);
    }
    const decoded = verify(token, env.JWT_ACCESS_SECRET);

    c.set("user", decoded);
    console.log(`<=====user object ====>  `,decoded)
     await next()
  } catch (error) {
    console.log(error);
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};

export const authorize = (role: "admin" | "user") => {
  // console.log(`role comming from authmiddlware is =============${role}`)
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    console.log(`user is ===> `,user)

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      throw new AppError("Forbidden", 403);
    }

    await next();
  };
};
