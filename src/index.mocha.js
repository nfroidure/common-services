'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const services = require('./index.js');

describe('index', () => {
  let files;

  before((done) => {
    fs.readdir(__dirname, (err, _files_) => {
      if(err) {
        done(err);
        return;
      }
      files = _files_;
      done();
    });
  });

  it('should import all services of the src folder', (done) => {
    Promise.all(
      files
      .filter(file => !['.', '..', 'index.js'].includes(file))
      .filter(file => !file.endsWith('.mocha.js'))
      .filter(file => !file.endsWith('.mock.js'))
      .map(file => require(path.join(__dirname, file))) // eslint-disable-line
    )
    .then((modules) => {
      assert.deepEqual(
        Object.keys(services).sort(),
        modules.map(module => module.name)
        .map(name => name.replace('bound ', ''))
        .sort()
      );
    })
    .then(() => done())
    .catch(done);
  });
});
