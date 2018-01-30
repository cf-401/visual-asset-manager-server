/*globals beforeAll, afterAll, expect*/
'use strict';

const request = require('superagent');
require('superagent-auth-bearer')(request);

const mongoose = require('../../lib/mongooseDB');
const app = require('../../lib/server');
const FileData = require('../../fileData/model');

process.env.DB_URL = 'mongodb://localhost:27017/visual_files_test';
process.env.PORT = 9002;
let server;
const PORT =  process.env.PORT;
const url = `localhost:${PORT}/api/v1/visual_files`;


//Authroization:"Bearer jwt"
describe('visual_files API', () => {

  beforeAll(() => {
    const DB = process.env.DB_URL;
    mongoose.connect(DB, {useMongoClient: true});
    FileData.remove({});

    server = app.listen(PORT);
  });

  beforeEach(() => {
    return FileData.remove({});
  });

  afterAll(() => {
    FileData.remove({});
    return mongoose.connection.close(function(){
      server.close();
    });
  });

  describe('GET', () => {
    test('it should get an array of meta data about files', () => {
      return request
        .get(url)
        .then(res => {
          expect(res.status).toBe(200);
          res = res.body;
          expect(Array.isArray(res));
        });
    });

    test('it should get a single metadata object given a valid id', () => {
      let testdata = new FileData({filename:'get-name', description: 'description-to-get', path: 'test-path'});
      return (testdata).save()
        .then((filedata) => {
          return request
            .get(`${url}/${filedata._id}`)
            .then(res => {
              expect(res.status).toBe(200);
              res = res.body;
              expect(res.name).toBe('get-name');
              expect(res.description).toEqual('description-to-get');
            });
        });
    });

    test('it should respond with 404 if not an existing id', () => {
      return request
        .get(`${url}/test-id`)
        .catch((err) => {
          expect(err.status).toEqual(404);

          expect(err.response.error.text).toEqual('cant find what you are looking for');
        });
    });
  });


  describe('POST', () => {
    test('it should create file metadata', () => {
      let testdata = new FileData({name:'post-name', description: 'description-get', path: 'path-get'});
      return request
        .post(url)
        .send(testdata)
        .then((res) => {
          expect(res.status).toEqual(200);
          res = res.body; //
          expect(res.name).toEqual('post-name');
          expect(res.description).toEqual('description-get');
          expect(res.path).toEqual('path-get');
        });
    });
    test('it responds with 400 if no body', () => {
      return request
        .post(url)
        .send()
        .catch(err => {
          expect(err.status).toEqual(400);
          expect(err.response.error.text).toEqual('errors: need a path, need a description, need a name,');
        });
    });
  });

  describe('PUT', () => {
    test('it should update with a put', () => {
      let testdata = new FileData({name:'name-put', description: 'description-put', path: 'path-put'});
      let changeddata = {name:'new-put-name', description: 'description-put-new', path: 'test-path-new'};
      return testdata.save()
        .then((file) => {
          return request
            .put(`${url}/${file._id}`)
            .send(changeddata)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.text).toEqual('success!');
            });
        });
    });

    test('it should respond with 404 if not found', () => {
      let changeddata = new FileData({name:'new-put-name', description: 'description-put-new', path: 'test-path-new'});
      return request
        .put(`${url}/id`)
        .send(changeddata)
        .catch(err => {
          expect(err.status).toEqual(404);
          expect(err.response.error.text).toEqual('id does not exist');
        });
    });

    test('it should respond with 400 if no body', () => {
      let testdata = new FileData({name:'put-name', description: 'description-put', path: 'path-put'});
      return testdata.save()
        .then((file) => {
          return request
            .put(`${url}/${file._id}`)
            .send()
            .catch(err => {
              expect(err.status).toEqual(400);
              expect(err.response.error.text).toEqual('errors: need a path, need a description, need a name,');
            });
        });
    });
  });
});
