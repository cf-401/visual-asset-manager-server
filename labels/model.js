//mongo schema
'use strict';

const mongoose = require('mongoose');

const labelsSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  color: {type: String},
});

labelsSchema.pre('find', function(){
  this.populate({ path: 'userId', select: 'username' });
});

module.exports = mongoose.model('labels', labelsSchema); // collection, Schema, creates constructor function
