'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('rtg:server');

const topicRouter = require('./route/topic-router.js');
const errors = require('./lib/error-middleware.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(topicRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`listening on: ${PORT}`);
});

server.isRunning = true;
