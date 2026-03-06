import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv(); 
export const minuteRateLimit = new Ratelimit({
    redis,
    prefix: "ratelimit-minute",
    limiter: Ratelimit.slidingWindow(5, "1 m") 
}); 
export const dayRateLimit = new Ratelimit({
    redis,
    prefix: "ratelimit-day",
    limiter: Ratelimit.slidingWindow(15, "24 h")
});