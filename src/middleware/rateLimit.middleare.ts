import redis from "../config/radis.config";
import type { Context, Next } from "hono";
import { AppError } from "../utils/AppError";

export const rateLmiterMiddleware = async (c: Context, next: Next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0] ||
    c.req.header("x-real-ip") ||
    "unknown";

  const key = `Rate:login${ip}`;

  let count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 5) {
    throw new AppError("try later ", 429);
  }

  await next();
};

export const loginLmiterMiddleware = async (c: Context, next: Next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0] ||
    c.req.header("x-real-ip") ||
    "unknown";
  const {email } =  await c.req.json()
 
  const key = `Rate:login${ip}:${email}`;

  let count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 5) {
    throw new AppError("try later ", 429);
  }

  await next();
};

export const refreshLmiterMiddleware = async (c: Context, next: Next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0] ||
    c.req.header("x-real-ip") ||
    "unknown";
  const {id } =  await c.get('user')
 

  const key = `Rate:login${ip}:${id}`;

  let count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 10) {
    throw new AppError("try later ", 429);
  }

  await next();
};

