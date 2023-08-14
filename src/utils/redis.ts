import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
console.log('Redis URL', redisUrl);
export const redisClient = createClient({ url: redisUrl });
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

