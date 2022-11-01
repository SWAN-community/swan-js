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
import { OWID } from '../owid-js/src/owid';
import { Base, IBase } from './base';
import { Rid } from './rid';
import { Sid } from './sid';
import { IPreferences, Preferences } from './preferences';
import { IIdentifier } from './identifier';

/**
 * Seed interface for use with JSON serialization.
 */
export interface ISeed extends IBase {
  transactionIds: string[];
  pubDomain: string;
  rid: IIdentifier;
  preferences: IPreferences;
  sid: IIdentifier;
  stopped: string[];
  source: OWID<Seed>;
}

/**
 * The Seed gathers data related to the Addressable Content and signs them.
 */
export class Seed extends Base<Seed> {

  transactionIds: string[];
  pubDomain: string;
  rid: Rid;
  preferences: Preferences;
  sid: Sid;
  stopped: string[];
  source: OWID<Seed>;

  /**
   * Constructs a new instance of Seed.
   * @param source of properties contained in the interface.
   */
  constructor(source?: ISeed) {
    super(source);
    if (source) {
      this.pubDomain = source.pubDomain;
      this.transactionIds = source.transactionIds;
      this.rid = new Rid(source.rid);
      this.preferences = new Preferences(source.preferences);
      this.sid = new Sid(source.sid);
      this.stopped = source.stopped;
    }
    this.source = new OWID<Seed>(this, source?.source);
  }

  /**
   * Adds the data needed for the OWID signing and verification.
   */
  public addOwidData(b: number[]) {
    if (!this.pubDomain) {
      throw 'pubDomain empty';
    }
    if (!this.transactionIds || this.transactionIds.length === 0) {
      throw 'transactionIds empty';
    }
    super.baseAddOwidData(b);
    Io.writeString(b, this.pubDomain);
    Io.writeStrings(b, this.transactionIds);
    this.rid.source.addToByteArray(b);
    this.preferences.source.addToByteArray(b);
    this.sid.source.addToByteArray(b);
  }
}