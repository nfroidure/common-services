'use strict';

import initProcessService from './delay';
import { reuseSpecialProps } from 'knifecycle';

export default reuseSpecialProps(initProcessService, initProcessMock);

async function initProcessMock() {}
