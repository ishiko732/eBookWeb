import request from "../config/request";

// redis
export const redisCache = () => request.get("system/cache/redis");

//health
export const systemHealth = () => request.get("system/health");

//message
export const systemMessage = () => request.get("system/cache/system");

//prometheus
export const prometheus = () => request.get("system/prometheus");
