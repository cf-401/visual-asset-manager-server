'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');//will be true everywhere mongoose

module.exports = mongoose;
