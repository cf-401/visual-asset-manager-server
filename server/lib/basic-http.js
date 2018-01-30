'use strict';
//header is coming in as 'Basic username:password'
module.exports = function(req, res, next) {
  try {
    let base64Header = req.headers.authorization.split('Basic ')[1];
    let buffer = new Buffer(base64Header, 'base64');
    let authArray = buffer.toString().split(':');
    let authObject = {
      email : authArray[0],
      password: authArray[1],
    };
    if (!authObject.email || ! authObject.password) {
      throw new Error('authenticat seyz noooooo!!!!');
    }
    req.auth = authObject;
    next();
  } catch (e) {
    next(e);
  }

};
