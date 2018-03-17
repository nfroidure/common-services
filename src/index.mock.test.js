'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const services = require('./index.mock.js');

describe('index.mock', () => {
  let files;

  beforeAll(done => {
    fs.readdir(__dirname, (err, _files_) => {
      if (err) {
        done(err);
        return;
      }
      files = _files_;
      done();
    });
  });

  test('should import all mocks of the src folder', done => {
    Promise.all(
      files
        .filter(file => !['index.mock.js'].includes(file))
        .filter(file => file.endsWith('.mock.js'))
        .map(file => require(path.join(__dirname, file))), // eslint-disable-line
    )
      .then(modules => {
        assert.deepEqual(
          Object.keys(services).sort(),
          modules
            .map(module => module.name)
            .map(name => name.replace('bound ', ''))
            .sort(),
        );
      })
      .then(() => done())
      .catch(done);
  });
});
