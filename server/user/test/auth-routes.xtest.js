/*globals beforeAll, afterAll, expect*/
'use strict';
require('dotenv').config();
const request = require('superagent');
const mongoose = require('../../lib/mongooseDB');
const app = require('../../lib/server');
const User = require('../../user/model');
const jwt = require('jsonwebtoken');

process.env.DB_URL = 'mongodb://localhost:27017/user_test';
process.env.PORT = 8000;
const PORT =  process.env.PORT;
const urlsignup = `localhost:${PORT}/api/v1/signup`;
const urlsignin = `localhost:${PORT}/api/v1/signin`;

let server;

describe('user auth', () => {

  beforeAll(() => {
    const DB = process.env.DB_URL;
    mongoose.connect(DB, {useMongoClient: true});
    server = app.listen(PORT);
    return User.remove({});
  });

  afterAll(() => {
    User.remove({});
    return mongoose.connection.close(function(){
      server.close();
    });
  });

  describe('signup', () => {

    test('it should create a user', () => {
      let testdata = new User({username:'name', password: 'test'});
      return request
        .post(urlsignup)
        .send(testdata)
        .then((res) => {
          let valid = jwt.verify(res.text, process.env.APP_SECRET);
          expect(res.status).toEqual(200);
          expect(valid._id.length).toBeGreaterThan(0);
        });
    });

    test('it responds with 400 if no body', () => {
      return request
        .post(urlsignup)
        .send()
        .catch(err => {
          expect(err.status).toEqual(400);
          expect(err.response.error.text).toEqual('data and salt arguments required');
        });
    });
  });

  describe('signin', () => {
    test('responds with token for a request with a valid basic authorization header', () => {
      return request
        .get(urlsignin)
        .auth('name', 'test')
        .then(res => {
          let valid = jwt.verify(res.text, process.env.APP_SECRET);
          expect(res.status).toBe(200);
          expect(valid._id.length).toBeGreaterThan(0);
        });
    });

    test('it should return an error the user is not in the database', () => {
      return request
        .get(urlsignin)
        .auth('this name does not exist', 'test')
        .catch(err => {
          expect(err.status).toEqual(400);
          expect(err.response.text).toEqual('no user');
        });
    });

    test('it should return an error if the password is wrong', () => {
      return request
        .get(urlsignin)
        .auth('name', 'wrong password')
        .catch(err => {
          expect(err.response.text).toEqual('password did not match what we have on file');
        });
    });
  });
});
