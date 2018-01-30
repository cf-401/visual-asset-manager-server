const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (! req.headers.authorization) {
    throw new Error('must authorize');
  }
  //check that we have a jwt
  let token = req.headers.authorization.split('Bearer ')[1];
  if (! token) {
    throw new Error('Invalid Authorization Provided');
  }
  let secret = process.env.APP_SECRET;
  let decodedToken = jwt.verify(token, secret);
  req.decodedId = decodedToken._id;
  next();
};
