import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
    // Render Redis
    redis = new Redis(process.env.REDIS_URL);
    console.log("Using production Redis");
} else {
    // Local development
    redis = new Redis({
        host: "127.0.0.1",
        port: 6379,
    });
    console.log("Using local Redis");
}

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redis;
