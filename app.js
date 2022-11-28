const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const routesUsers = require('./routes/users');
const routesMovies = require('./routes/movies');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
    console.log('Сервер экспресс запущен');
  });

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routesUsers);
app.use('/movies', routesMovies);