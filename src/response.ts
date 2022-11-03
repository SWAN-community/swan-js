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
import { Bid } from './bid';
import { Empty } from './empty';
import { Failed } from './failed';
import { Seed } from './seed';
import { IWriteable, Writeable } from './writeable';

/**
 * Classes that inherit from Response and form nodes in a tree of response.
 */
export type ResponseTypes = Bid | Empty | Failed;

/**
 * First byte of the data structure will be the type of response.
 */
export enum ResponseType {
  Bid = 1,
  Failed = 2,
  Empty = 3
}

export interface IResponseNode extends IWriteable {
  children: (Bid | Failed | Empty)[] | undefined;
}

/**
 * Response class used by receivers of the seed to sign to indicate they have 
 * received the data. The inheriting classes provide details concerning the
 * type of response and might include their own signed data to provide OWID
 * compatible proof they were the source of the data. For example; a DSP might
 * sign the creative payload with an OWID to confirm it came from them.
 */
export abstract class Response<T extends OWIDTarget> extends Writeable<T> {

  /**
   * The type of structure the response relates to. This is needed where the 
   * data is to be marshalled to a byte array that does not support field 
   * names like JSON.
   */
  responseType: ResponseType;

  /**
   * The seed for the transmission. Should not be set from the request.
   */
  seed: Seed;

  /**
   * Adds the response type to the byte array as a single byte follow by the 
   * relevant data from the seed.
   * @param b byte array to add to
   * @returns b
   */
  public addOwidData(b: number[]): number[] {
    super.addOwidData(b);
    this.seed.addOwidData(b);
    return b;
  }

  /**
   * Adds the response type to the byte array as a single byte.
   * @param b byte array to add to
   * @returns b
   */
  protected addToByteArray(b: number[]): number[] {
    super.baseAddToByteArray(b);
    Io.writeByte(b, this.responseType);
    return b;
  }

  protected getFromByteArray(b: Reader) {
    super.baseFromByteArray(b);
    this.responseType = Io.readByte(b);
  }
}