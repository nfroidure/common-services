import assert from 'assert';
import fs from 'fs';
import path from 'path';
import * as services from './index.mock.js';

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
        .map(file => require(path.join(__dirname, file)).default), // eslint-disable-line
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
