const User = require(__dirname + '/model');

const superagent = require('superagent');
const slackTranform = require('../fileData/slack-to-file-data');
const FileData = require('../fileData/model');
const URL = process.env.CLIENT_URL;
const cookieOptions = {
  maxAge: 900000,
  domain: process.env.NODE_ENV === 'production'? '.vam.fun' : null,
};

let slackHandler = module.exports = {};

slackHandler.getSlackToken = (req, res, next) => {
  console.log(req.query.code);
  let code = req.query.code;
  superagent.get(`https://slack.com/api/oauth.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`)
    .then((res) => {
      console.log('got token', res.body.access_token);
      req.slackToken = res.body.access_token;
      return next();
    })
    .catch(err => {
      next(err.message);
    });
};

slackHandler.getUserFromSlack = (req, res, next) => {
  superagent.get(`https://slack.com/api/users.identity?token=${req.slackToken}`)
    .then((res) => {
      const responseBody = res.body;
      if (responseBody.ok) {
        const newUser = {
          username: responseBody.user.name,
          slackId: responseBody.user.id,
          slack: responseBody.team.id,
          email: 'email',
          password: req.slackToken,
        };
        req.slackUserData = newUser;
        next();
      }
    });
};

slackHandler.lookupUserBySlackId = (req, res, next) => {

  User.findOne({slackId: req.slackUserData.slackId})
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(next);
};

slackHandler.makeUserFromSlack = (req, res, next) => {
  if (!req.user) {
    (new User(req.slackUserData)).generateHash(req.slackUserData.password)
      .then((user) => {
        user.save()
          .then(returnedUser => {
            console.log(returnedUser);
            let token = returnedUser.generateToken();
            req.user = returnedUser;
            req.vamToken = token;
            return next();
          });
      });
  }
  let token = req.user.generateToken();
  req.vamToken = token;
  next();
};


slackHandler.getSlackFileData = (req, res) => {
  superagent.get(`https://slack.com/api/files.list?token=${req.slackToken}`)
    .then((listData) => {
      const responseBody = listData.body;
      if (responseBody.ok) {
        Promise.all(
          responseBody.files.reduce((acc, cur) => {
            if (slackTranform(req.user._id, cur)){
              acc.push (slackTranform(req.user._id, cur));
            }
            return acc;
          }, []).map((tosave) => {
            let newFileData = new FileData(tosave);
            console.log(newFileData);
            return newFileData.save()
              .catch(() => {
                console.log('dup');
              });
          })
        ).then(() => {
          res.cookie('auth', req.vamToken, cookieOptions);
          res.redirect(URL);
        })
          .catch(err=> {
            console.log(err);
            res.redirect(URL);
          });
      }
    });
};
