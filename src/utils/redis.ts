import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
console.log('Redis URL', redisUrl, process.env.REDIS_URL);
export const redisClient = createClient({ url: redisUrl });
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

