const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found');
const ForbiddenError = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner }).sort({ createdAt: -1 })
    .then((result) => {
      res.send(result);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      const owner = movie.owner.toString();
      const userId = req.user._id;

      if (owner !== userId) {
        throw new ForbiddenError('Отстутствуют права на удаление');
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((result) => res.send(result))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный id'));
      }
      return next(err);
    });
};
