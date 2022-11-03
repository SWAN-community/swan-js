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

import { Io, Reader } from '../owid-js/src/io';
import { OWID } from '../owid-js/src/owid';
import { Rid } from './rid';
import { Sid } from './sid';
import { IPreferences, Preferences } from './preferences';
import { IIdentifier } from './identifier';
import { IWriteable, Writeable } from './writeable';

/**
 * Seed interface for use with JSON serialization.
 */
export interface ISeed extends IWriteable {
  transactionIds: string[];
  pubDomain: string;
  rid: IIdentifier;
  preferences: IPreferences;
  sid: IIdentifier;
  stopped: string[];
}

/**
 * The Seed gathers data related to the Addressable Content and signs them.
 */
export class Seed extends Writeable<Seed> {

  /**
   * Transaction IDs.
   */
  public transactionIds: string[];

  /**
   * The publisher's domain.
   */
  public pubDomain: string;

  /**
   * Random IDentifier. See Model Terms.
   */
  public rid: Rid;

  /**
   * Marketing preferences. See Model Terms.
   */
  public preferences: Preferences;

  /**
   * Signed in Identifier. See Model Terms.
   */
  public sid: Sid;

  /**
   * Array of advert identifiers that have been stopped by the user.
   */
  public stopped: string[];

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
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * Unlike base 64 serialization the persisted member is serialized.
   * @returns a fresh IIdentifier instance for serialization.
   */
  public toJSON() {
    return {
      version: this.version,
      pubDomain: this.pubDomain,
      transactionIds: this.transactionIds,
      rid: this.rid,
      preferences: this.preferences,
      sid: this.sid,
      stopped: this.stopped,
      source: this.source,
    };
  }

  protected addToByteArray(b: number[]): number[] {
    if (!this.pubDomain) {
      throw 'pubDomain empty';
    }
    if (!this.transactionIds || this.transactionIds.length === 0) {
      throw 'transactionIds empty';
    }
    super.baseAddToByteArray(b);
    Io.writeString(b, this.pubDomain);
    Io.writeStrings(b, this.transactionIds);
    this.rid.addToByteArray(b);
    this.preferences.addToByteArray(b);
    this.sid.addToByteArray(b);
    Io.writeStrings(b, this.stopped);
    return b;
  }

  protected getFromByteArray(b: Reader) {
    super.baseFromByteArray(b);
    this.pubDomain = Io.readString(b);
    this.transactionIds = Io.readStrings(b);
    this.rid = new Rid();
    this.rid.getFromByteArray(b);
    this.preferences = new Preferences();
    this.preferences.getFromByteArray(b);
    this.sid = new Sid();
    this.sid.getFromByteArray(b);
    this.stopped = Io.readStrings(b);
  }
}