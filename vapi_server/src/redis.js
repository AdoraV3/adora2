// src/redis.js
import "dotenv/config";
import Redis from "ioredis";

const url = process.env.REDIS_URL || "redis://localhost:6379";
console.log("DEBUG → Initializing Redis with URL:", url.replace(/:[^:@]+@/, ":***@"));

export const redis = new Redis(url, {
  maxRetriesPerRequest: 20,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (e) => console.error("Redis error:", e.message));

export async function streamAdd(key, obj) {
  // Store events in a Redis Stream under field name "event"
  return redis.xadd(key, "*", "event", JSON.stringify(obj));
}

export async function streamRange(key, start = "-", end = "+", count = 200) {
  // Read back events and return raw XRANGE reply
  return redis.xrange(key, start, end, "COUNT", count);
}


