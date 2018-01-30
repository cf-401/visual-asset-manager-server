//from https://github.com/codefellows/seattle-javascript-401n4/blob/ceecbdd636a3a48cea4a11ffe66b0ebf76a4d9b4/backend/18-asset-management/demos/samples/lib/s3.js
'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');
const s3 = new aws.S3({params: {Bucket: process.env.AWS_BUCKET}});

// resolve a url

const upload = (path, key) => {
  return s3.upload({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  })
    .promise()
    .then(res => { // onSuccess
      return fs.remove(path) // delete local file
        .then(() => res.Location); // resolve s3 url
    })
    .catch(err => { // onFailure
      return fs.remove(path) // delete local file
        .then(() => Promise.reject(err)); // continue rejecting error
    });

};

const remove = (key) => {
  return s3.deleteObject({
    Key: key,
    Bucket: process.env.Bucket,
  })
    .promise();
};


module.exports = {upload, remove};
