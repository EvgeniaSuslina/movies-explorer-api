const rateLimit = require('express-rate-limit');

const mongoUrlAdress = 'mongodb://localhost:27017/moviesdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter, mongoUrlAdress };
