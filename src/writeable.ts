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
import { OWIDTarget } from '../owid-js/src/target';
import { IBase, Base } from './base';

export interface IWriteable extends IBase {
  /**
   * True if the instance is persisted, false if not.
   */
  persisted: boolean;
}

/**
 * Base class used by all entities that can be stored in the web browser. 
 */
export abstract class Writeable<T extends OWIDTarget>
  extends Base<T> implements IWriteable {

  /**
   * True if the instance is persisted, false if not.
   */
  persisted = false;

  constructor(source?: IWriteable) {
    super(source);
    if (source) {
      this.persisted = source.persisted;
    }
  }

  /**
   * Adds the data from this instance for the OWID signing and verification.
   */
  public abstract addOwidData(b: number[]): number[];

  /**
   * Populates this instance with the data from the byte array.
   * @param b byte array
   */
  public abstract fromByteArray(b: Reader);

  /**
   *
   * @returns this instance as a byte array
   */
  public toByteArray(): Uint8Array {
    const a = this.source.addToByteArray(this.addOwidData([]));
    return Uint8Array.from(a);
  }

  /**
   * Populate the instance from the base 64 string.
   * @param b
   * @returns this instance
   */
  public fromBase64(b: string): T {
    const a = Io.byteArrayFromBase64(b);
    return this.fromByteArray(new Reader(a));
  }

  /**
   * The identifier as a base 64 string.
   * @returns 
   */
  public toBase64(): string {
    return Io.byteArrayToBase64(this.toByteArray());
  }
}