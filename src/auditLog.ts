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

import { ResponseNode } from './responseNode';
import { Seed } from './seed';

/**
 * The seed used for an openRTB request, along with a specific transaction Id
 * from that seed, and the response root for the audit log. The root is usually
 * the signed seed from the publisher.
 */
export class AuditLog {
  
  seed: string; // Seed in base 64 format
 
  /**
   * Transaction ID from the seed that the response nodes relate to
   */
  transactionId: string;

  roots: ResponseNode[]; // The response nodes and their children.

  /**
   * The seed for the audit log from the base 64 string.
   * @returns an instance of the seed
   */
  public getSeed(): Seed {
    const s = new Seed();
    s.fromBase64(this.seed);
    return s;
  }
}

/**
 * Public interface used to bind an audit handler to the specific audit data and
 * DOM component.
 */
export interface AuditHandler {

  /**
   * Binds the element to the audit handler. If it up to the audit handler to 
   * determine how it displays the trigger icon.
   * @param element 
   */
  bind(element: HTMLElement): void;
}