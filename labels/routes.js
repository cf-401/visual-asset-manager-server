'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();

const ServerError = require('../lib/error');
const bearerAuth = require('../lib/bearer-auth');
const userHandler = require('../user/user-auth-middleware');

const Label = require('./model');

const labelRouter = module.exports = express.Router();

labelRouter.get('/asset_labels',
  (req, res, next) => {
    console.log('getting labels');
    Label.find({})
      .then(labels => {
        res.status(200).send(labels);
      })
      .catch(err => {
        next(new ServerError (404, 'cant find what you are looking for', err));
      });
  });

labelRouter.post('/asset_labels',
  bearerAuth,
  userHandler.getUserById,
  jsonParser,
  (req, res, next) => {
    req.body.userId = req.user._id;
    console.log('post, req.body', req.body);
    let newLabel = new Label(req.body);
    console.log('__newLabel___', newLabel);
    newLabel.save()
      .then(data => res.status(200).send(data))
      .catch((err) => {
        console.log(err);
        next(err, newLabel);
      });
  });

labelRouter.delete(
  '/asset_labels/:id',
  bearerAuth,
  userHandler.getUserById,
  jsonParser,
  (req, res, next) => {
    console.log(req.params);
    Label.find({_id: req.params.id})
      .then( () => {
        Labels.remove({_id: req.params.id})
          .then(() => res.status(200).send('label successfully deleted'))
          .catch((err) => {
            next(err, req.body);
          });
      });
  });
