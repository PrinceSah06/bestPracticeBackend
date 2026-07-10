import  Redis from "ioredis"
import { env } from "./env";


const redis = new Redis(env.REDIS_URL);
 redis.on("error", (err) => {
  console.error("❌ Valkey error:", err);
});

redis.on("connect", () => {
  console.log("✅ Valkey connected");
});
redis.on("ready", () => {
  console.log("Redis ready");
});



export default redis;