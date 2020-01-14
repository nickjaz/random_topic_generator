'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Topic = require('../model/topic.js');
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT || 3000}`;

const exampleTopic = {
  title: 'test topic',
};

describe('Topic routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });

  after(done => {
    serverToggle.serverOff(server, done);
  });

  afterEach(done => {
    Promise.all([
      Topic.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('POST: /api/topic', function() {
    after( done => {
      if(this.tempTopic) {
        Topic.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
      done();
    });

    describe('valid request', () => {
      it('should return 200 and a topic', done => {
        request.post(`${url}/api/topic`)
        .send(exampleTopic)
        .end((err, res) => {
          if(err) return done(err);
          let date = new Date(res.body.created).toString();
          expect(res.body.title).to.equal(exampleTopic.title);
          expect(res.status).to.equal(200);
          expect(date).to.not.equal('Invalid Date');
          this.tempTopic = res.body;
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.post(`${url}/api/topic`)
        .send({ wizard: 'dumbledore'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET: /api/topic/:id', function() {
    before(done => {
      new Topic(exampleTopic).save()
      .then(topic => {
        this.tempTopic = topic;
        done();
        return;
      })
      .catch(done);
    });

    after(done => {
      if(this.tempTopic) {
        Topic.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
    });

    describe('valid request', () => {
      it('should return 200 and a topic', done => {
        request.get(`${url}/api/topic/${this.tempTopic._id}`)
        .end((err, res) => {
          if(err) return done(err);
          let date = new Date(res.body.created).toString();
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('test topic');
          expect(date).to.not.equal('Invalid Date');
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.get(`${url}/api/topic/1234567890`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/topic/:id', function() {
    before(done => {
      new Topic(exampleTopic).save()
      .then(topic => {
        this.tempTopic = topic;
        done();
        return;
      })
      .catch(done);
    });

    after(done => {
      if(this.tempTopic) {
        Topic.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
    });

    describe('valid request', () => {
      it('should return 200 and updated topic', done => {
        request.put(`${url}/api/topic/${this.tempTopic._id}`)
        .send({ title: 'new title' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('new title');
          done();
        });
      });
    });

    describe('nonexsistent id', () => {
      it('should return 404 status code', done => {
        request.put(`${url}/api/topic/123456789`)
        .send({ title: 'new title' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.put(`${url}/api/topic/${this.tempTopic._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/topic/:id', function() {
    before(done => {
      new Topic(exampleTopic).save()
      .then(topic => {
        this.tempTopic = topic;
        done();
        return;
      })
      .catch(done);
    });

    after(done => {
      if(this.tempTopic) {
        Topic.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
    });

    describe('valid request', () => {
      it('should return 204 status code', done => {
        request.delete(`${url}/api/topic/${this.tempTopic._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.delete(`${url}/api/topic/123456789`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
