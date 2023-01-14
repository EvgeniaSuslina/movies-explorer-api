const router = require('express').Router();
const auth = require('../middlewares/auth');
const routesUsers = require('./users');
const routesMovies = require('./movies');
const { createUser, login } = require('../controllers/users');
const { validationCreateUser, validationLogin } = require('../utils/celebrate');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', routesUsers);
router.use('/movies', routesMovies);

module.exports = router;
