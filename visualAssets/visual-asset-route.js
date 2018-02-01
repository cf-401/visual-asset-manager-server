'use strict';

const { Router } = require('express');
const multer = require('multer');

const s3 = require('../lib/s3.js');
const bearerAuth = require('../lib/bearer-auth');

const visualAsset = require('./model');
const userHandler = require('../user/user-auth-middleware');

const upload = multer({dest: `${__dirname}/../temp`});

module.exports = new Router()
  .post('/upload',
    bearerAuth,
    userHandler.getUserById,
    upload.any(),
    (req, res, next) => {

      let file = req.files[0];

      let key = `${file.filename}.${file.originalname}`;
      return s3.upload(file.path, key)
        .then(url => {
          console.log('url', url);
          return new visualAsset({
            account: req.user._id,
            url,
          }).save();
        })
        .then(file => res.json(file))
        .catch(next);
    });
