/* ****************************************************************************
 * Copyright 2021 51 Degrees Mobile Experts Limited (51degrees.com)
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

import { Io } from '@owid/io';
import { OWID } from '@owid/owid';
import { Base } from './base';
import { Identifier } from './identifier';
import { Preferences } from './preferences';

/**
 * The Seed gathers data related to the Addressable Content and signs them.
 */
 export class Seed extends Base {

    transactionIds: Uint8Array[];
    pubDomain: string;
    rid: Identifier;
    preferences: Preferences;
    sid: Identifier;
    stopped: string[];
    source: OWID<Seed>;
  
    /**
     * Adds the data needed for the OWID signing and verification.
     */
    addOwidData(b: number[]) {
      super.addOwidData(b);
      Io.writeString(b, this.pubDomain);
      Io.writeByteArrayArray(b, this.transactionIds);
      this.rid.source.addTargetAndOwidData(b);
      Io.writeByteArrayNoLength(b, this.rid.source.signatureArray);
      this.preferences.source.addTargetAndOwidData(b);
      Io.writeByteArrayNoLength(b, this.preferences.source.signatureArray);
      this.sid.source.addTargetAndOwidData(b);
      Io.writeByteArrayNoLength(b, this.sid.source.signatureArray);
      Io.writeStrings(b, this.stopped);
    }
  }