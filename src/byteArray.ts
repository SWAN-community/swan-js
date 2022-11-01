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
import { OWIDTarget } from '../owid-js/src/target';
import { IWriteable, Writeable } from './writeable';

/**
 * Byte array interface for use with JSON serialization.
 */
export interface IByteArray extends IWriteable {

  /**
   * The byte array value as a base 64 string.
   */
  value: string;
}

/**
 * Any byte array that might be signed with an OWID. For example; the hash of 
 * the email and the pass code.
 */
export abstract class ByteArray<T extends OWIDTarget>
  extends Writeable<T> implements IByteArray {

  /**
   * The byte array value as a base 64 string.
   */
  value: string;

  /**
   * Returns the value as a byte array for crypto and storage operations.
   */
  get valueByteArray(): Uint8Array {
    return Io.byteArrayFromBase64(this.value);
  }
  set valueByteArray(value: Uint8Array) {
    this.value = Io.byteArrayToBase64(value);
  }

  constructor(source?: IByteArray) {
    super(source);
    if (source) {
      this.value = source.value;
    }
  }
}
