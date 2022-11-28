const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found');
const ConflictError = require('../errors/conflict');


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