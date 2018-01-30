'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const UserData = require('./model');
const ServerError = require('../lib/error');


const userRouter = module.exports = express.Router();

function errorCheck(err, body){
  let error = new ServerError(404, 'id does not exist', err);
  error.checkRequired('user', body);
  return error;
}

userRouter.get('/users', (req, res, next) => {
  let findObject = req.query || {};
  UserData.find(findObject)
    .then(files => res.status(200).send(files))
    .catch(err => next(new ServerError (404, 'cant find what you are looking for', err)));
});

userRouter.get('/users/:id', (req, res, next) => {
  UserData.findOne({_id : req.params.id})
    .then(files => res.status(200).send(files))
    .catch(err => next(new ServerError (404, 'cant find what you are looking for', err)));
});

userRouter.post('/users', jsonParser, (req, res, next) => {
  let newUserData = new UserData(req.body);
  newUserData.save() // saves the file to the database
    .then(data => res.status(200).send(data))
    .catch((err) => {
      next(errorCheck(err, newUserData));
    });
});

userRouter.patch('/users/:id', jsonParser, (req, res, next) => {
  let newUserData = new UserData(req.body);
  delete newUserData._id;
  UserData.findOneAndUpdate({_id : req.params.id}, {$set:newUserData})
    .then(() => res.status(200).send('success!'))
    .catch((err) => {
      next(errorCheck(err, newUserData));
    });
});

userRouter.put('/users/:id', jsonParser, (req, res, next) => {
  let newUserData = new UserData(req.body).toJSON();
  delete newUserData._id;
  UserData.findOneAndUpdate({_id: req.params.id}, newUserData)
    .then(() => res.status(200).send('success!'))
    .catch((err) => {
      next(errorCheck(err, newUserData));
    });
});

userRouter.delete('/users', jsonParser, (req, res, next) => {
  UserData.remove({_id: req.params.id})
    .then(() => res.status(200).send('metadata successfully deleted'))
    .catch((err) => {
      next(errorCheck(err, req.body));
    });
});
