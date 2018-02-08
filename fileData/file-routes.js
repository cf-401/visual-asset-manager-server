'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();

const ServerError = require('../lib/error');
const bearerAuth = require('../lib/bearer-auth');
const userHandler = require('../user/user-auth-middleware');

const FileData = require('./model');


const fileRouter = module.exports = express.Router();

function errorCheck(err, body){
  let error = new ServerError(404, 'id does not exist', err);
  error.checkRequired('filemetadata', body);
  return error;
}

fileRouter.get(
  '/visual_files',
  bearerAuth,
  userHandler.getUserById,
  (req, res, next) => {
  // let findObject = req.query || {};
    let findObject = {};
    FileData.find(findObject)
      .then(files => {
        res.status(200).send(files);
      })
      .catch(err => {
        next(new ServerError (404, 'cant find what you are looking for', err));
      });
  });

fileRouter.get('/visual_files/:id', (req, res, next) => {
  FileData.findOne({_id : req.params.id})
    .then(files => res.status(200).send(files))
    .catch(err => next(new ServerError (404, 'cant find what you are looking for', err)));
});

fileRouter.post('/visual_files', bearerAuth, userHandler.getUserById, jsonParser, (req, res, next) => {
  req.body.userId = req.user._id;
  console.log('post, req.body', req.body);
  let newFileData = new FileData(req.body);
  console.log('__newFileData___', newFileData);
  newFileData.save() // saves the file to the database
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err);
      next(errorCheck(err, newFileData));
    });
});

fileRouter.patch(
  '/visual_files/:id',
  bearerAuth,
  userHandler.getUserById,
  jsonParser,
  (req, res, next) => {
    let newFileData = new FileData(req.body);
    newFileData._id = null;
    const fileDataUser = newFileData.userId._id;
    const requestUser = req.user._id;
    if (fileDataUser !== requestUser.toString()) {
      return next({statusCode: 403, message: 'you dont have authority to change someone elses file'});
    }
    FileData.findOneAndUpdate({_id : req.params.id}, {$set:newFileData})
      .then(() => res.status(200).send('success!'))
      .catch((err) => {
        next(errorCheck(err, newFileData));
      });
  });

fileRouter.put(
  '/visual_files/',
  bearerAuth,
  userHandler.getUserById,
  jsonParser,
  (req, res, next) => {
    let newFileData = Object.assign({}, req.body);
    newFileData._id = null;
    delete newFileData._id;
    const fileDataUser = newFileData.userId._id;
    const requestUser = req.user._id;
    if (fileDataUser !== requestUser.toString()) {
      return next({statusCode: 403, message: 'you dont have authority to change someone elses file'});
    }
    FileData.findOneAndUpdate({_id: req.body._id}, newFileData)
      .then(() => {
        res.status(200).send('success!');
      })
      .catch((err) => {
        next(errorCheck(err, newFileData));
      });
  });

fileRouter.delete(
  '/visual_files/:id',
  bearerAuth,
  userHandler.getUserById,
  jsonParser,
  (req, res, next) => {
    FileData.find({_id: req.params.id})
      .then( (file) => {
        let fileToDelete = file[0];
        const fileDataUser = fileToDelete.userId._id;
        const requestUser = req.user._id;
        if (fileDataUser.toString() !== requestUser.toString()) {
          return next({statusCode: 403, message: 'you dont have authority to change someone elses file'});
        }
        FileData.remove({_id: req.params.id})
          .then(() => res.status(200).send('metadata successfully deleted'))
          .catch((err) => {
            next(errorCheck(err, req.body));
          });

      });
  });
