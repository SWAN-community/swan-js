/* ****************************************************************************
 * Copyright 2022 51 Degrees Mobile Experts Limited (51degrees.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * ***************************************************************************/

import { Empty } from '../src/empty';
import {
  testJsonResponse,
  testPass,
  testWrongSigner,
  createEmpty,
  testBase64Response
} from './shared';

describe('response empty', () => {
  test('pass', async () => {
    await testPass<Empty>(createEmpty);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Empty>(createEmpty);
  });
  test('serialize JSON', async () => {
    await testJsonResponse<Empty>(createEmpty, (s) => new Empty(s));
  });
  test('serialize base 64', async () => {
    await testBase64Response<Empty>(createEmpty);
  });
});
