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
import { IOWID, OWID } from '../owid-js/src/owid';
import { OWIDTarget } from '../owid-js/src/target';

/**
 * Version number as a positive byte.
 */
export type Version = number;

export interface IBase {

  /**
   * Indicates the version for the entity.
   */
  version: Version;

  /**
   * OWID associated with the writable entity.
   */
  source: IOWID;
}

/**
 * Base class used for all entities that can be signed.
 */
export class Base<T extends OWIDTarget> implements IBase {

  /**
   * Indicates the version for the entity.
   */
  public version: Version = 1;

  /**
   * True if the OWID related to the entity has been verified with the signer. 
   * This must be reset if any other fields associated with the entity are
   * changed.
   */
  public verified = false;

  /**
   * OWID associated with the entity.
   */
  public source: OWID<T>;

  constructor(source?: IBase) {
    if (source) {
      this.version = source.version;
    }
  }

  /**
   * Adds the version byte to the byte array.
   * @param b 
   */
  protected baseAddOwidData(b: number[]) {
    Io.writeByte(b, this.version);
  }

  /**
   * Sets the version byte from the byte array.
   * @param b 
   */
  protected baseFromByteArray(b: Reader) {
    this.version = Io.readByte(b);
  }
}