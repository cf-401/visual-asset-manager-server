'use strict';

const mongoose = require('mongoose');

const visualAssetSchema = mongoose.Schema({
  url: {type: String, required: true},
  account: {type: mongoose.Schema.Types.ObjectId, required: true},
  created: {type: Date, default: () => new Date},
});

module.exports = mongoose.model('visualAsset', visualAssetSchema);
