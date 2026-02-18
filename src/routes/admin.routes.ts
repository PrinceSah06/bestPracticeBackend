import { Hono } from "hono";
import { authMiddleware, authorize } from "../middleware/auth.middleware";
import { getAlluser } from "../controller/admin.controller";

const adminRoute = new Hono();



adminRoute.get("/users",authMiddleware,authorize("admin"),getAlluser)

export default adminRoute