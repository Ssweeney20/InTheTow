const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
      username: 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URI,
        port: 15121
      }
    });

redisClient.on('error', err => console.log('Redis Client Error', err));

module.exports = redisClient;