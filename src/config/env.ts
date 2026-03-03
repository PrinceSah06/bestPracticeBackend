 import { config } from "dotenv";
 import {z} from 'zod'

config();

const envSchema = z.object({
PORT: z.coerce.number().default(3000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
});


const safeParsed = envSchema.safeParse(process.env)

if(!safeParsed.success){
  console.error("❌ Invalid environment variables:");
  console.error(safeParsed.error.format());
  process.exit(1)
}
export const env = safeParsed.data;
