const routesUsers = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { validationUpdateUser } = require('../utils/celebrate');

routesUsers.get('/me', getUserInfo);
routesUsers.patch('/me', validationUpdateUser, updateUserInfo);

module.exports = routesUsers;
