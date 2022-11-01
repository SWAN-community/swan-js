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

import { Reader, Io } from '../owid-js/src/io';
import { OWID } from '../owid-js/src/owid';
import { OWIDTarget } from '../owid-js/src/target';
import { PreferencesData } from './preferencesData';
import { IWriteable, Writeable } from './writeable';

/**
 * Preferences interface for use with JSON serialization.
 */
export interface IPreferences extends IWriteable {
  /**
   * Preference data.
   */
  data: PreferencesData;
}

/**
 * Preference data with an associated OWID. 
 */
export class Preferences extends Writeable<Preferences> implements OWIDTarget {

  /**
   * Preference data.
   */
  data: PreferencesData;

  /**
   * The OWID indicating the party that captured the preferences.
   */
  source: OWID<Preferences>;

  constructor(source?: IPreferences) {
    super(source);
    if (source) {
      Object.assign(this, source);
    }
    this.source = new OWID<Preferences>(this, source?.source);
  }

  /**
   * Adds the target preference flag to the byte array as a single 0 or 1 byte.
   * @param b byte array to add the preference flag to
   */
  public addOwidData(b: number[]): number[] {
    super.baseAddOwidData(b);
    Io.writeByte(b, this.data.use_browsing_for_personalization === true ? 1 : 0);
    return b;
  }

  /**
   * Populates the members with the contents of the byte array.
   * @param b source byte array
   */
  public fromByteArray(b: Reader): Preferences {
    super.baseFromByteArray(b);
    if (!this.data) {
      this.data = new PreferencesData();
    }
    this.data.fromByteArray(b);
    if (!this.source) {
      this.source = new OWID(this);
    }
    this.source.fromByteArray(b);
    return this;
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * Unlike base 64 serialization the persisted member is serialized.
   * @returns a fresh IPreferences instance for serialization.
   */
  public toJSON(): IPreferences {
    return {
      version: this.version,
      data: this.data,
      source: this.source,
      persisted: this.persisted
    };
  }
}
