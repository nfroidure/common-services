'use strict';

const initProcessService = require('./delay');
const { reuseSpecialProps } = require('knifecycle/dist/util');

export default reuseSpecialProps(initProcessService, initProcessMock);

function initProcessMock() {
  return Promise.resolve();
}
