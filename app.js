require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const { errors } = require('celebrate');
const helmet = require("helmet");

const router = require('./routes/index');
const NotFoundError = require('./errors/not_found');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/config')

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
    console.log('Сервер экспресс запущен');
});

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемые данные не найдены'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});