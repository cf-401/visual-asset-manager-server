'use strict';

const jest = require('jest');
const mocha = require('mocha');
const expect = require('expect');

let res = { sendStatus:jest.fn() };
let req = {};
let next = jest.fn();

const ServerError = require('../error.js');

describe('Error', () => {

  it('responds with a given status code', () => {
    ServerError({statusCode:409}, req, res, next);
    expect(res.sendStatus).toBe(409);
  });

  it('defaults to 500 when no error is given', () => {
    ServerError('Cougs', req, res, next);
    expect(res.sendStatus).toBe(500);
  });

  it('defaults to 500 when there is an error but no status code is present', () => {
    ServerError('Cougs', req, res, next);
    expect(res.sendStatus).toBe(500);
  });
});
