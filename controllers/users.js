require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found');
const ConflictError = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,      
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Почта уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
    const id = req.user._id;
    const { name, email } = req.body;
 
    User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    )
      .then((user) => {
        if (user) {
          res.send({
            email: user.email,
            name: user.name,
          });
        } else {
          next(new NotFoundError('Пользователь не найден.'));
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('При обновлении данных пользователя были переданы некорректные данные'));
        } else if (err.name === 'CastError') {
          next(new BadRequestError('Введен некорректный id пользователя'));
        } else {
          next(err);
        }
      });
};