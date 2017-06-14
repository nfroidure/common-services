'use strict';

const initProcessService = require('./delay');
const { reuseSpecialProps } = require('knifecycle/dist/util');

module.exports = reuseSpecialProps(initProcessService, initProcessMock);

function initProcessMock() {
  return Promise.resolve();
}
