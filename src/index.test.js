import assert from 'assert';
import fs from 'fs';
import path from 'path';
import * as services from './index.js';

describe('index', () => {
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

  test('should import all services of the src folder', done => {
    Promise.all(
      files
        .filter(file => !['.', '..', 'index.js'].includes(file))
        .filter(file => !file.endsWith('.test.js'))
        .filter(file => !file.endsWith('.mock.js'))
        .map(file => require(path.join(__dirname, file)).default), // eslint-disable-line
    )
      .then(modules => {
        assert.deepEqual(
          Object.keys(services)
            .sort()
            .map(name => name.replace(/Service$/, '')),
          modules
            .map(module => module.name)
            .map(name => name.replace(/(bound )*/, ''))
            .sort(),
        );
      })
      .then(() => done())
      .catch(done);
  });
});
