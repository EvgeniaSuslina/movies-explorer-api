const routesMovies = require('express').Router();
const { getMovies, createMovie, deleteMovie} = require('../controllers/movies');
const {validationCreateMovie, validationDeleteMovie} = require('../utils/celebrate');

routesMovies.post('/', validationCreateMovie, createMovie);
routesMovies.get('/', getMovies);
routesMovies.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = routesMovies;