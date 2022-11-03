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
import { Bid } from './bid';
import { Empty } from './empty';
import { Failed } from './failed';
import { ResponseType } from './response';
import { Seed } from './seed';

/**
 * A node for the response in a JSON tree.
 */
export class ResponseNode {
  v: string; // Base 64 response. Unpacks to Bid, Failed, or Empty.
  c?: ResponseNode[]; // Optional array of child response nodes.

  /**
   * Get the response for the value v.
   */
  public getResponse(seed: Seed): Bid | Failed | Empty {
    let r: Bid | Failed | Empty;
    const b = Io.byteArrayFromBase64(this.v);
    switch(b[0]) {
      case ResponseType.Bid:
        r = new Bid().fromByteArray(b);
        break;
      case ResponseType.Empty:
        r = new Empty().fromByteArray(b);
        break;
      case ResponseType.Failed:
        r = new Failed().fromByteArray(b);
        break;
      default:
        throw `response type '${b[0]}' invalid`;
    }
    r.seed = seed;
    return r;
  }
}