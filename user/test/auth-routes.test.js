'use strict';

// const jest = require('jest');
const expect = require('expect');
// const request = require('superagent')
const PORT =  process.env.PORT;
const authRouter = require('../auth-routes.js');

describe('Auth routes', () => {

  // before

  it('sign up', (done) => {
    return authRouter.post('process.env.PORT').end(function(err, res){
      expect(res.status).toBe(500);
      done();
    });
  });

});
