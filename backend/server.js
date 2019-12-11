'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('rtg:server');
const topicRouter = require('./route/topic-router.js');
const errors = require('./lib/error-middleware.js');
const PORT = process.env.PORT || PORT;

const app = express();
mongoose.connect(process.env.MONGODB_URI);

app.use(morgan('dev'));
app.use(topicRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug('listening on: ' + PORT);
});

server.isRunning = true;
