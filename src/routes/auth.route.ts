import { Hono } from "hono";

import {
  logOutController,
  loginController,
  refreshController,
  registerController,
} from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLmiterMiddleware } from "../middleware/rateLimit.middleare";

const authRoute = new Hono();

authRoute.post("/register", rateLmiterMiddleware, registerController);

authRoute.post("/login", rateLmiterMiddleware, loginController);
authRoute.post(
  "/logout",
  rateLmiterMiddleware,
  authMiddleware,
  logOutController,
);

authRoute.post(
  "/refresh",
  rateLmiterMiddleware,

  
);

export default authRoute;
