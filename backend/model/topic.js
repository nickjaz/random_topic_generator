'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = Schema({
  title: { type: String, required: true }
});

module.exports = mongoose.model('topic', topicSchema);
