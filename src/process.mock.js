'use strict';

import initProcessService from './delay';
import { reuseSpecialProps } from 'knifecycle/dist/util';

export default reuseSpecialProps(initProcessService, initProcessMock);

async function initProcessMock() {}
