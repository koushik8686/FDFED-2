// redisClient.js
const redis = require('redis');

let client;

async function getRedisClient() {
    if (!client) {
        client = redis.createClient({ url: process.env.REDIS_URL }); // Optional: use URL for cloud
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();
    }
    return client;
}

module.exports = getRedisClient;
