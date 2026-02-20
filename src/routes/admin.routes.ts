import { Hono } from "hono";
import { authMiddleware, authorize } from "../middleware/auth.middleware";
import { getAlluser ,deleteController,updateControler, changeRoleController, restoreAccountController, userStatsController} from "../controller/admin.controller";

const adminRoute = new Hono();



adminRoute.get("/users",authMiddleware,authorize("admin"),getAlluser);
adminRoute.patch("/users/:id/delete",authMiddleware,authorize("admin"),deleteController)
adminRoute.patch("/users/:id/update",authMiddleware,authorize("admin"),updateControler);
adminRoute.patch("/users/:id/role",authMiddleware,authorize("admin"),changeRoleController);
adminRoute.patch("/users/:id/restore",authMiddleware,authorize("admin"),restoreAccountController);
adminRoute.patch("/users/stats",authMiddleware,authorize("admin"),userStatsController);




export default adminRoute