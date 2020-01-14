'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = Schema({
  title: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('topic', topicSchema);
