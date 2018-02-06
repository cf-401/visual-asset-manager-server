'use strict';

const jsonParser = require('body-parser').json();

const basicHttp = require(__dirname + '/../lib/basic-http');
const userHandler = require('./user-auth-middleware');
const bearerAuth = require('../lib/bearer-auth');

const authRouter = module.exports = require('express').Router();
const logger = (req, res, next) => {
  // console.log(req);
  next();
};

authRouter.post(
  '/signup',
  jsonParser,
  userHandler.createUser
);

authRouter.get(
  '/signin',
  basicHttp,
  userHandler.getUserByName,
  userHandler.signIn
);

authRouter.get(
  '/validate',
  logger,
  bearerAuth,
  userHandler.getUserById,
  userHandler.validate
);

authRouter.delete(
  '',
  bearerAuth,
  userHandler.delete
);

authRouter.put(
  '/update',
  jsonParser,
  bearerAuth,
  userHandler.put
);
