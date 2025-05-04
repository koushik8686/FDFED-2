// redisClient.js
const { createClient } = require('redis');

let client;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: "rediss://default:AYEYAAIjcDEyMmVmMzk1MDJiZTE0NzQzODk5NTk3M2UxMWE1M2NiZnAxMA@absolute-guppy-33048.upstash.io:6379", // Use rediss://...
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
  }

  return client;
}

module.exports = getRedisClient;
