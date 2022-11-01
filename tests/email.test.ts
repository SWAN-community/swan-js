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

import { Email } from '../src/email';
import { createArtifact } from '../owid-js/tests/artifact';
import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import {
  createSigned,
  testBase64,
  testJson,
  testPass,
  testWrongSigner,
  createEmail
} from './shared';

describe('email', () => {
  test('pass', async () => {
    await testPass<Email>(createEmail);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Email>(createEmail);
  });
  test('serialize base 64', async () => {
    await testBase64<Email>(createEmail);
  });
  test('serialize JSON', async () => {
    await testJson<Email>(createEmail, (s) => new Email(s));
  });
  test('fail wrong value', async () => {
    const a = await createArtifact();
    const e = await createSigned<Email>(a.signer, createEmail);
    e.value += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
