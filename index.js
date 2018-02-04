'use strict';
require('dotenv').config();
console.log(process.env.PORT);
const PORT = process.env.PORT || 5000;
const DB = process.env.DB_URL || 'mongodb://localhost:27017/visual_files_dev';

const mongoose = require('./lib/mongooseDB');
mongoose.connect(DB, {useMongoClient: true});

const app = require(__dirname + '/lib/server.js');

app.listen(PORT, () => {console.log(`listening at port ${PORT}`);});
