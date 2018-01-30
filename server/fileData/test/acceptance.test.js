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


});
