import  Redis from "ioredis"
import { env } from "./env";


const redis = new Redis("redis://127.0.0.1:6379");
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