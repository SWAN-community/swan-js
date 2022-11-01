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
import { Rid } from '../src/rid';
import { createArtifact } from '../owid-js/tests/artifact';
import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import {
  createSigned,
  testBase64,
  testJson,
  testPass,
  testWrongSigner,
  createRid
} from './shared';

describe('rid', () => {
  test('pass', async () => {
    await testPass<Rid>(createRid);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Rid>(createRid);
  });
  test('serialize base 64', async () => {
    await testBase64<Rid>(createRid);
  });
  test('serialize JSON', async () => {
    await testJson<Rid>(createRid, (s) => new Rid(s));
  });
  test('fail wrong type', async () => {
    const a = await createArtifact();
    const i = await createSigned<Rid>(a.signer, createRid);
    i.idType = IdentifierType.sid;
    const r = await i.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
  test('fail wrong value', async () => {
    const a = await createArtifact();
    const i = await createSigned<Rid>(a.signer, createRid);
    const b = i.valueByteArray;
    b[0]++;
    i.valueByteArray = b;
    const r = await i.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
