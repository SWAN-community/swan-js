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
import { OWIDTarget } from '../owid-js/src/target';
import { ByteArray, IByteArray } from './byteArray';

/**
 * Possible types of identifier.
 */
export enum IdentifierType {
  rid = 'rid', // Random ID as defined in the Model Terms
  sid = 'sid' // Signed in ID from the hash of the email and salt
}

/**
 * Identifier interface for use with JSON serialization.
 */
export interface IIdentifier extends IByteArray {

  /**
   * The identifier type.
   */
  idType: IdentifierType;
}

/**
 * Identifier associated with an OWID.
 */
export abstract class Identifier<T extends OWIDTarget> extends ByteArray<T>
  implements OWIDTarget, IIdentifier {

  /**
   * The identifier type.
   */
  idType: IdentifierType;

  /**
   * Constructs a new instance of Identifier.
   * @param source of properties contained in the interface.
   */
  constructor(source?: IIdentifier) {
    super(source);
    if (source) {
      this.idType = source.idType;
    }
  }

  protected abstract createSource(): OWID<T>;

  /**
   * Populates the members with the contents of the byte array.
   * @param b source byte array
   * @returns this identifier
   */
  public fromByteArray(b: Reader) {
    super.baseFromByteArray(b);
    this.idType = Io.readString(b) as IdentifierType;
    this.valueByteArray = Io.readByteArray(b);
    if (!this.source) {
      this.source = this.createSource();
    }
    this.source.fromByteArray(b);
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * Unlike base 64 serialization the persisted member is serialized.
   * @returns a fresh IIdentifier instance for serialization.
   */
  public toJSON(): IIdentifier {
    return {
      version: this.version,
      idType: this.idType,
      value: this.value,
      source: this.source,
      persisted: this.persisted
    };
  }

  /**
   * Adds the data needed for the OWID signing and verification.
   */
  public addOwidData(b: number[]): number[] {
    if (!this.valueByteArray) {
      throw 'empty identifier value';
    }
    super.baseAddOwidData(b);
    Io.writeString(b, this.idType);
    Io.writeByteArray(b, this.valueByteArray);
    return b;
  }

  /**
   * Printable version of the value.
   * @returns 
   */
  public asPrintable(): string {
    return this.toHexString(this.valueByteArray);
  }

  private toHexString(byteArray: Uint8Array) {
    let s = '';
    byteArray.forEach((byte) => {
      s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
  }
}
