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
import { OWID } from '../owid-js/src/owid';
import { IResponseNode, ResponseNode } from './responseNode';

export interface IFailed extends IResponseNode {
  host: string;
  error: string;
}

/**
 * A response where the sender did not receive a response from the receiver.
 */
export class Failed extends ResponseNode<Failed> {

  /**
   * The domain that did not respond.
   */
  host: string;

  /**
   * The error message to add to the tree.
   */
  error: string;

  constructor(source?: IFailed) {
    super(source);
    if (source) {
      this.host = source.host;
      this.error = source.error;
    }
    this.source = new OWID<Failed>(this, source?.source);
  }

  /**
   * Adds the failed data to the OWID data.
   * @param b
   */
  public addOwidData(b: number[]) {
    super.addOwidData(b);
    Io.writeString(b, this.host);
    Io.writeString(b, this.error);
  }
}