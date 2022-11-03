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
import { IResponseNode, Response } from './response';

export interface IBid extends IResponseNode {
  mediaURL: string;
  advertiserURL: string;
}

/**
 * Bid contains the information about the advert to be displayed.
 */
export class Bid extends Response<Bid> {

  /**
   * The URL of the content of the advert provided in response.
   */
  mediaURL: string;

  /**
   * The URL to direct the browser to if the advert is selected.
   */
  advertiserURL: string;

  constructor(source?: IBid) {
    super(source);
    if (source) {
      this.mediaURL = source.mediaURL;
      this.advertiserURL = source.advertiserURL;
    }
    this.source = new OWID<Bid>(this, source?.source);
  }

  /**
   * Adds the mediaURL and advertiserURL to the byte array.
   * @param b byte array to add to
   * @returns b
   */
  protected addToByteArray(b: number[]): number[] {
    super.addToByteArray(b);
    Io.writeString(b, this.mediaURL);
    Io.writeString(b, this.advertiserURL);
    return b;
  }

  /**
   * Populates the members with the contents of the byte array.
   * @param b source byte array
   */
  protected getFromByteArray(b: Reader) {
    super.getFromByteArray(b);
    this.mediaURL = Io.readString(b);
    this.advertiserURL = Io.readString(b);
  }
}