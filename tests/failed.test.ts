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

import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import { createArtifact } from '../owid-js/tests/artifact';
import { Failed } from '../src/failed';
import {
  testJsonResponse,
  testPass,
  testWrongSigner,
  createFailed,
  createSigned,
  testBase64Response
} from './shared';

describe('response failed', () => {
  test('pass', async () => {
    await testPass<Failed>(createFailed);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Failed>(createFailed);
  });
  test('serialize JSON', async () => {
    await testJsonResponse<Failed>(createFailed, (s) => new Failed(s));
  });
  test('serialize base 64', async () => {
    await testBase64Response<Failed>(createFailed);
  });
  test('fail wrong host', async () => {
    const a = await createArtifact();
    const e = await createSigned<Failed>(a.signer, createFailed);
    e.host += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
  test('fail wrong error', async () => {
    const a = await createArtifact();
    const e = await createSigned<Failed>(a.signer, createFailed);
    e.error += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
