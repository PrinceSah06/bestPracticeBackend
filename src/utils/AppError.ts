import type { ContentfulStatusCode } from "hono/utils/http-status";
import { stat } from "node:fs";

export class AppError extends Error{
    statusCode:ContentfulStatusCode;

    constructor(message:string,statusCode:ContentfulStatusCode){
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this,AppError.prototype)
    }
}