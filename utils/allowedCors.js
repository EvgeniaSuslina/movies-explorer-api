const allowedCors = {
    origin: [
      'http://localhost:3000',
      'https://locahost:3000',
      'https://evgenia.movies-explorer.nomoredomains.club',
      'http://evgenia.movies-explorer.nomoredomains.club',
    ],
    credentials: true,
  };
  
  module.exports = allowedCors;