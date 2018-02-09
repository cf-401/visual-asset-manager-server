//mongo schema
'use strict';

const mongoose = require('mongoose');

const fileMetaDataSchema = new mongoose.Schema({
  filename: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  userId : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  path : {type: String, required: true, unique: true},
  description : {type: String, required: true},
  public: {type: Boolean, default: false},
  labels : {type: mongoose.Schema.Types.Mixed},
});

fileMetaDataSchema.pre('find', function(){
  this.populate({ path: 'userId', select: 'username' });
});

module.exports = mongoose.model('filemetadata', fileMetaDataSchema); // collection, Schema, creates constructor function
