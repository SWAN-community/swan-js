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
import { IWriteable, Writeable } from './writeable';

/**
 * Email interface for use with JSON serialization.
 */
export interface IEmail extends IWriteable {

  /**
   * The byte array value
   */
  value: string;
}

/**
 * Raw email address.
 */
export class Email extends Writeable<Email> implements IEmail {

  /**
   * The byte array value
   */
  value: string;

  constructor(source?: IEmail) {
    super(source);
    if (source) {
      this.value = source.value;
    }
    this.source = new OWID<Email>(this, source?.source);
  }

  /**
   * Populates the members with the contents of the byte array.
   * @param b source byte array
   * @returns this email
   */
  protected getFromByteArray(b: Reader): Email {
    super.baseFromByteArray(b);
    this.value = Io.readString(b);
    return this;
  }

  /**
   * Adds the email address string to the byte array.
   * @param b byte array to add to
   * @returns b
   */
  protected addToByteArray(b: number[]): number[] {
    super.baseAddToByteArray(b);
    Io.writeString(b, this.value);
    return b;
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * Unlike base 64 serialization the persisted member is serialized.
   * @returns a fresh IEmail instance for serialization.
   */
  public toJSON(): IEmail {
    return {
      version: this.version,
      value: this.value,
      source: this.source,
      persisted: this.persisted
    };
  }
}