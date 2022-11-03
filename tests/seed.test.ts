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
import { Seed } from '../src/seed';
import {
  createSigned,
  testJson,
  testPass,
  testWrongSigner,
  createSeed,
  testBase64
} from './shared';

describe('seed', () => {
  test('pass', async () => {
    await testPass<Seed>(createSeed);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Seed>(createSeed);
  });
  test('serialize JSON', async () => {
    await testJson<Seed>(createSeed, (s) => new Seed(s));
  });
  test('serialize base 64', async () => {
    await testBase64<Seed>(createSeed);
  });
  test('fail wrong value', async () => {
    const a = await createArtifact();
    const e = await createSigned<Seed>(a.signer, createSeed);
    e.pubDomain += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
  test('length', async () => {
    const a = await createArtifact();
    const e = await createSigned<Seed>(a.signer, createSeed);
    console.log(
      `seed length > base 64: '${e.toBase64().length}' bytes | ` +
      `json: '${JSON.stringify(e).length}' bytes`);
  });
});
