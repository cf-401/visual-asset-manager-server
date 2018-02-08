'use strict';
const User = require(__dirname + '/model');


let userHandler = module.exports = {};

userHandler.getUserByName = (req, res, next) => {

  User.findOne({email: req.auth.email})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};

userHandler.getUserById = (req, res, next) => {

  User.findOne({_id: req.decodedId})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};

userHandler.signIn = (req, res, next) => {

  req.user.comparePassword(req.auth.password)
    .then(user => {
      if (user instanceof Error) {
        next({statusCode: 401, message: user.message});
      }
      let token = user.generateToken();
      res.cookie('auth', token, { maxAge: 10000000 });
      res.send({user,token});
    })
    .catch(err =>
      next({statusCode: 403, message: err.message}));
};

userHandler.createUser = (req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  console.log('creating user', req.body);
  (new User(req.body)).generateHash(password)
    .then((user) => {
      user.save()
        .then(user => {
          let token = user.generateToken();
          console.log('saved and got token');

          res.cookie('auth', token, { maxAge: 10000000,  domain: '.vam.fun'});
          res.send({user, token});
        })
        .catch(err => {
          next({statusCode: 400, message: `error saving user ${err.message}`});
        });
    })
    .catch(err => next({statusCode: 400, message: `error getting hash ${err.message}`}));
};

userHandler.validate = (req, res, next) => {

  User.findOne({_id: req.user._id})
    .then(user => {
      let token = user.generateToken();
      res.cookie('auth', token, { maxAge: 900000, domain: '.vam.fun' });
      res.send({user,token});
    })
    .catch(next);
};
