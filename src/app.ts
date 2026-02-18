import { Hono } from "hono";
import authRoute from './routes/auth.route'
import connectDB from "./DB/connectDB";
import { errorMiddleware } from "./middleware/error.middleware";
import type { UserPayload } from "./types/hono";
import adminRoute from "./routes/admin.routes";
type Variables = {
  user: UserPayload;
};
const app =  new Hono<{ Variables: Variables }>()
 await connectDB()

app.use("*",errorMiddleware)


app.route("/auth",authRoute)
app.route("/admin",adminRoute)





export default app