'use strcit';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('stg:topic-router');
const Topic = require('../model/topic.js');

const topicRouter = module.exports = Router();

topicRouter.post('/api/topic', jsonParser, function(req, res, next) {
  debug('POST: /api/topic');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));

  req.body.created = new Date();
  new Topic(req.body).save()
  .then(topic => res.json(topic))
  .catch(next);
});

topicRouter.get('/api/topic/:id', function(req, res, next) {
  debug('GET: /api/topic/:id');

  Topic.findById(req.params.id)
  .then(topic => {
    if (!topic) return next(createError(404, 'Topic not found'));
    res.json(topic);
  })
  .catch(err => next(createError(404, err.message)));
});

topicRouter.put('/api/topic/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/topic/:id');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));

  Topic.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then(topic => res.json(topic))
  .catch(err => {
    if (err.name === 'Validation Error') return next(err);
    next(createError(404, err.message));
  });
});

topicRouter.delete('/api/topic/:id', function(req, res, next) {
  debug('DELETE: /api/topic/:id');

  Topic.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
