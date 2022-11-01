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

import { Preferences } from '../src/preferences';
import { createArtifact } from '../owid-js/tests/artifact';
import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import {
  createSigned,
  testBase64,
  testJson,
  testPass,
  testWrongSigner,
  createPreferences
} from './shared';


describe('preferences', () => {
  test('pass', async () => {
    await testPass<Preferences>(createPreferences);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Preferences>(createPreferences);
  });
  test('serialize base 64', async () => {
    await testBase64<Preferences>(createPreferences);
  });
  test('serialize JSON', async () => {
    await testJson<Preferences>(createPreferences, (s) => new Preferences(s));
  });
  test('fail wrong flag', async () => {
    const a = await createArtifact();
    const p = await createSigned<Preferences>(a.signer, createPreferences);
    p.data.use_browsing_for_personalization =
      !p.data.use_browsing_for_personalization;
    const r = await p.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
