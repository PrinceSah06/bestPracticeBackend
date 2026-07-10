import type { Context, Next } from "hono";
import { AppError } from "../utils/AppError";


export async function errorMiddleware(c: Context, next: Next) {

    try {
        await next()
    } catch (error : any) {
        if (error instanceof AppError) {
            return c.json({
                message: error.message,
            }, error.statusCode)
        }
        console.error("Unexpected Error:", error);

        return c.json(
            { message: "Internal Server Error" },
            500
        );
    }

}