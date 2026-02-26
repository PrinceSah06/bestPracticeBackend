import  Redis from "ioredis"



    const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});


redis.on("connect", () => {
  console.log("✅ Valkey connected");
});
redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (err) => {
  console.error("❌ Valkey error:", err);
});

export default redis;