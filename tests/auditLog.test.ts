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
import { Seed } from '../src/seed';
import { createAuditLog, validateAuditLog } from './shared';

describe('audit log', () => {
  test('pass', async () => {
    const a = await createAuditLog(2, 2);
    await validateAuditLog(a.s, a.l, VerifiedStatus.Valid);
  });
  test('fail', async () => {
    const a = await createAuditLog(2, 2);
    const seed = new Seed();
    seed.fromBase64(a.l.seed);
    seed.pubDomain += ' ';
    a.l.seed = seed.toBase64();
    await validateAuditLog(a.s, a.l, VerifiedStatus.NotValid);
  });
});
