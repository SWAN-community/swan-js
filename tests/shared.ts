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

import { Signer } from '../owid-js/src/signer';
import { Artifact, createArtifact } from '../owid-js/tests/artifact';
import { VerifiedStatus } from '../owid-js/src/verifiedStatus';
import { Writeable } from '../src/writeable';
import { Email } from '../src/email';
import { IdentifierType } from '../src/identifier';
import { Io } from '../owid-js/src/io';
import { parse, v4 as uuidv4 } from 'uuid';
import { Preferences } from '../src/preferences';
import { Salt } from '../src/salt';
import { Seed } from '../src/seed';
import { Rid } from '../src/rid';
import { Sid } from '../src/sid';
import { Base } from '../src/base';
import { OWIDTarget } from '../owid-js/src/target';
import { Bid } from '../src/bid';
import { ResponseNode } from '../src/responseNode';
import { Empty } from '../src/empty';
import { Failed } from '../src/failed';
import { PreferencesData } from '../src/preferencesData';

/**
 * Create a new RID identifier with a UUID.
 * @returns 
 */
export function createRid(): Rid {
  const i = new Rid();
  i.idType = IdentifierType.rid;
  i.value = Io.byteArrayToBase64(Uint8Array.from(parse(uuidv4())));
  return i;
}

/**
 * Create a new SID identifier from the standard email and salt.
 * @returns 
 */
export async function createSid(): Promise<Sid> {
  const i = new Sid();
  i.idType = IdentifierType.sid;
  await i.setHash(createEmail(), createSalt());
  return i;
}

/**
 * Create a new email.
 * @returns 
 */
export function createEmail(): Email {
  const e = new Email();
  e.value = 'test@test.com';
  return e;
}

/**
 * Create a new preferences instance set to true.
 * @returns 
 */
export function createPreferences(): Preferences {
  const p = new Preferences();
  p.data = new PreferencesData(true);
  return p;
}

/**
 * Create a new salt.
 * @returns 
 */
export function createSalt(): Salt {
  const e = new Salt();
  e.valueByteArray = Uint8Array.from([1, 2, 3, 4]);
  return e;
}

/**
 * Creates a new seed for a transaction.
 * @returns 
 */
export async function createSeed(): Promise<Seed> {
  const a = await createArtifact();
  const seed = new Seed();
  seed.rid = await createSigned(a.signer, createRid);
  seed.preferences = await createSigned(a.signer, createPreferences);
  seed.sid = await createSigned(a.signer, createSid);
  seed.pubDomain = Artifact.testDomain;
  seed.transactionIds = ['1234', '5678'];
  return seed;
}

/**
 * Creates a new seed for a transaction and a bid response associated with it.
 * @returns 
 */
export async function createBid(): Promise<Bid> {
  const a = await createArtifact();
  const bid = new Bid();
  bid.seed = await createSigned(a.signer, createSeed);
  bid.advertiserURL = Artifact.testDomain + '/advertiserURL';
  bid.mediaURL = Artifact.testDomain + '/mediaURL';
  return bid;
}

/**
 * Creates a new seed for a transaction and a failed response associated with it.
 * @returns 
 */
export async function createFailed(): Promise<Failed> {
  const a = await createArtifact();
  const failed = new Failed();
  failed.seed = await createSigned(a.signer, createSeed);
  failed.host = Artifact.testDomain;
  failed.error = 'error';
  return failed;
}

/**
 * Creates a new seed for a transaction and a empty response associated with it.
 * @returns 
 */
export async function createEmpty(): Promise<Empty> {
  const a = await createArtifact();
  const empty = new Empty();
  empty.seed = await createSigned(a.signer, createSeed);
  return empty;
}

/**
 * Creates a new signed instance of the writeable entity T.
 * @param signer 
 * @param create
 * @returns a new signed and verified instance of T
 */
export async function createSigned<T extends Base<OWIDTarget>>(
  signer: Signer,
  create: () => T | Promise<T>): Promise<T> {
  let e = create();
  if (e instanceof Promise) {
    e = await e;
  }
  await e.source.signWithSigner(signer);
  expect(e.source.signer).toBe(signer);
  expect(e.source.status).toBe(VerifiedStatus.NotStarted);
  return e;
}

/**
 * Tests that the verify with signer method results in a Valid result.
 * @param create 
 */
export async function testPass<T extends Base<OWIDTarget>>(
  create: () => T | Promise<T>) {
  const a = await createArtifact();
  const e = await createSigned(a.signer, create);
  const r = await e.source.verifyWithSigner(a.signer);
  expect(r).toBe(VerifiedStatus.Valid);
}

/**
 * Tests that using a different signer that the one that created the instance
 * results in a NotValid result.
 * @param create 
 */
export async function testWrongSigner<T extends Base<OWIDTarget>>(
  create: () => T | Promise<T>) {
  const a = await createArtifact();
  const o = await createArtifact();
  const e = await createSigned(a.signer, create);
  const r = await e.source.verifyWithSigner(o.signer);
  expect(r).toBe(VerifiedStatus.NotValid);
}

/**
 * Tests that the serialization to JSON and deserialization result with an 
 * instance that passed verification with the original signer.
 * @param create 
 * @param fromInterface a new instance of T form JSON string
 */
export async function testJson<T extends Base<OWIDTarget>>(
  create: () => T | Promise<T>,
  fromInterface: (any) => T) {
  const a = await createArtifact();
  const e = await createSigned(a.signer, create);
  const j = JSON.stringify(e);
  const c = fromInterface(JSON.parse(j));
  const r = await c.source.verifyWithSigner(a.signer);
  expect(r).toBe(VerifiedStatus.Valid);
}

/**
 * Tests that the serialization to JSON and deserialization result with a
 * response instance that passed verification with the original signer. 
 * Considers the seed that was used with the response in verification.
 * @param create 
 * @param fromInterface a new instance of T form JSON string
 */
export async function testJsonResponse<T extends ResponseNode<T>>(
  create: () => T | Promise<T>,
  fromInterface: (any) => T) {
  const a = await createArtifact();
  const e = await createSigned(a.signer, create);
  const j = JSON.stringify(e);
  const c = fromInterface(JSON.parse(j));
  c.seed = e.seed;
  const r = await c.source.verifyWithSigner(a.signer);
  expect(r).toBe(VerifiedStatus.Valid);
}

/**
 * Tests that the serialization to base 64 and deserialization result in an 
 * instance that passed verification with the original signer.
 * @param create 
 */
export async function testBase64<T extends Writeable<T>>(
  create: () => T | Promise<T>) {
  const a = await createArtifact();
  const e = await createSigned(a.signer, create);
  const b = e.toBase64();
  const c = await create();
  c.fromBase64(b);
  const r = await c.source.verifyWithSigner(a.signer);
  expect(r).toBe(VerifiedStatus.Valid);
}