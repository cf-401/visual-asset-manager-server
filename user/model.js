//mongo schema
'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  group: {type: String},
  password : {type: String, require: true},
  slackId: {type: String},
  email : {type: String},
  assets : [{}],
  aboutMe: {type: String},
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashAsync(password, 10)
    .then((hashed) => {
      this.password = hashed;
      return this;
    });
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareAsync(password, this.password)
    .then(res => {
      if (res) {
        return this;
      }
      return new Error('password did not match what we have on file');
    });
};

userSchema.methods.generateToken = function(){
  return jwt.sign({ _id: this._id}, process.env.APP_SECRET);
};

userSchema.methods.getAuthorizationLevel = function(){

};


module.exports = mongoose.model('User', userSchema); // collection, Schema, creates constructor function
