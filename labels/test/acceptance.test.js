/*globals beforeAll, afterAll, expect*/
'use strict';
require('dotenv').config();

const request = require('superagent');
require('superagent-auth-bearer')(request);

const mongoose = require('../../lib/mongooseDB');
const app = require('../../lib/server');
const Label = require('../model');
const User = require('../../user/model');

process.env.DB_URL = 'mongodb://localhost:27017/visual_files_test';
process.env.PORT = 9002;

let server;

const PORT =  process.env.PORT;
const url = `localhost:${PORT}/api/v1`;
const assetUrl = `${url}/asset_labels`;
//Authroization:"Bearer jwt"
describe('asset_labels API', () => {
  const testLabel = { name : 'super cool label'};
  const testLabel2 = { name : 'another cool label'};

  beforeAll(() => {
    const DB = process.env.DB_URL;
    mongoose.connect(DB, { useMongoClient: true });
    Label.remove({});
    server = app.listen(PORT);

  });

  beforeEach(() => {
    // User.remove({});
    return Label.remove({});
  });

  afterAll(() => {
    Label.remove({});
    User.remove({});
    return mongoose.connection.close(function(){
      server.close();
    });
  });

  describe('asset label get', () => {
    test('it gets all labels in the database', () => {
      let newLabel = new Label(testLabel);
      return newLabel.save().then(() => {
        return request
          .get(assetUrl)
          .then(res => {
            expect(res.body[0].name).toEqual('super cool label');
          });
      });
    });

  });
  describe('asset label post', () => {
    test('it saves a new label in the database', () => {

      const user ={
        email: 'email@gmail.com',
        password: 'password',
        username: 'username',
      };
      return request
        .post(`${url}/signup`)
        .send(user)
        .then(res => {
          let token = res.body.token;
          return request
            .post(assetUrl)
            .set('Authorization', `Bearer ${token}`)
            .send(testLabel2)
            .then(res => {
              expect(res.body.name).toEqual('another cool label');
            });
        });
    });
  });
});
