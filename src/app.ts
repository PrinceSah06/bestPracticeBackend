import { Hono } from "hono";
import authRoute from './routes/auth.route'
import connectDB from "./DB/connectDB";
import { errorMiddleware } from "./middleware/error.middleware";
import type { UserPayload } from "./types/hono";
import adminRoute from "./routes/admin.routes";
import { AppError } from "./utils/AppError";
import { config } from "dotenv"

 config()
type Variables = {
  user: UserPayload;
};
const app =  new Hono<{ Variables: Variables }>()
 await connectDB()

 // app.ts

app.onError((err, c) => {
  const e = err as any;
  if (e && typeof e.statusCode === "number") {
    return c.json({ message: e.message ?? "Error" }, e.statusCode);
  }
  console.error("Unexpected Error:", err);
  return c.json({ message: "Internal Server Error" }, 500);
});


app.use("*",errorMiddleware)


app.route("/auth",authRoute)
app.route("/admin",adminRoute)





export default app