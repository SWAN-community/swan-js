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
import { ByteArray } from './byteArray';
import { IWriteable } from './writeable';

/**
 * Salt interface for use with JSON serialization.
 */
export interface ISalt extends IWriteable {

  /**
   * The byte array value
   */
  value: string;
}

/**
 * Salt used to hash with the email address to form the SID.
 */
export class Salt extends ByteArray<Salt> implements ISalt {

  /**
   * OWID associated with the byte array.
   */
  source: OWID<Salt>;

  constructor(source?: ISalt) {
    super(source);
    this.source = new OWID<Salt>(this, source?.source);
  }

  /**
   * Adds the data needed for the OWID signing and verification.
   */
  public addOwidData(b: number[]): number[] {
    super.baseAddOwidData(b);
    Io.writeByteArray(b, this.valueByteArray);
    return b;
  }

  /**
   * Populates the members with the contents of the byte array.
   * @param b source byte array
   * @returns this salt
   */
  public fromByteArray(b: Reader): Salt {
    super.baseFromByteArray(b);
    this.valueByteArray = Io.readByteArray(b);
    if (!this.source) {
      this.source = new OWID(this);
    }
    this.source.fromByteArray(b);
    return this;
  }
  /**
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * Unlike base 64 serialization the persisted member is serialized.
   * @returns a fresh ISalt instance for serialization.
   */
  public toJSON(): ISalt {
    return {
      version: this.version,
      value: this.value,
      source: this.source,
      persisted: this.persisted
    };
  }
}
