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
import { Bid } from '../src/bid';
import {
  createSigned,
  testJsonResponse,
  testPass,
  testWrongSigner,
  createBid
} from './shared';

describe('response bid', () => {
  test('pass', async () => {
    await testPass<Bid>(createBid);
  });
  test('fail wrong signer', async () => {
    await testWrongSigner<Bid>(createBid);
  });
  test('serialize JSON', async () => {
    await testJsonResponse<Bid>(createBid, (s) => new Bid(s));
  });
  test('fail wrong advertiserURL', async () => {
    const a = await createArtifact();
    const e = await createSigned<Bid>(a.signer, createBid);
    e.advertiserURL += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
  test('fail wrong mediaURL', async () => {
    const a = await createArtifact();
    const e = await createSigned<Bid>(a.signer, createBid);
    e.mediaURL += ' ';
    const r = await e.source.verifyWithSigner(a.signer);
    expect(r).toBe(VerifiedStatus.NotValid);
  });
});
