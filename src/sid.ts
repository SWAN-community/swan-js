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

import { Io } from '../owid-js/src/io';
import { Email } from './email';
import { Identifier, IIdentifier } from './identifier';
import { Salt } from './salt';
import { Crypto } from '../owid-js/src/crypto';
import { OWID } from '../owid-js/src/owid';

/**
 * Signed In ID. See Model Terms for details.
 */
export class Sid extends Identifier<Sid> {

  constructor(source?: IIdentifier) {
    super(source);
    this.source = new OWID<Sid>(this, source?.source);
  }

  /**
   * Set the signed in identifier based on the email and salt provided.
   * @param email 
   * @param salt 
   */
  public async setHash(email: Email, salt: Salt) {
    const b: number[] = [];
    Io.writeString(b, email.value);
    Io.writeByteArrayNoLength(b, salt.valueByteArray);
    this.valueByteArray = await Crypto.hash(Uint8Array.from(b));
  }
}