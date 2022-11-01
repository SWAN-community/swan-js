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

import { IdentifierType } from '../src/identifier';
import { Sid } from '../src/sid';
import { createArtifact } from '../owid-js/tests/artifact';
import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import {
  createSigned,
  testBase64,
  testJson,
  testPass,
  testWrongSigner,
  createSid
} from './shared';

describe('sid', () => {
  test('pass', async () => {
    await testPass<Sid>(createSid);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Sid>(createSid);
  });
  test('serialize base 64', async () => {
    await testBase64<Sid>(createSid);
  });
  test('serialize JSON', async () => {
    await testJson<Sid>(createSid, (s) => new Sid(s));
  });
  test('fail wrong type', async () => {
    const a = await createArtifact();
    const i = await createSigned<Sid>(a.signer, createSid);
    i.idType = IdentifierType.rid;
    const r = await i.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
  test('fail wrong value', async () => {
    const a = await createArtifact();
    const i = await createSigned<Sid>(a.signer, createSid);
    const b = i.valueByteArray;
    b[0]++;
    i.valueByteArray = b;
    const r = await i.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
