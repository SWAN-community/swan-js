/* ****************************************************************************
 * Copyright 2021 51 Degrees Mobile Experts Limited (51degrees.com)
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

import { IOWID } from '@owid/owid';
import { IBase, Base } from './base';

export interface IWriteable extends IBase {
    /**
     * True if the instance is persisted, false if not.
     */
    persisted: boolean;
  
    /**
     * OWID associated with the identifier.
     */
    source: IOWID;
  }
  
  /**
   * Base class used by all entities that can be stored in the web browser. 
   */
  export class Writeable extends Base {
  
    /**
     * True if the instance is persisted, false if not.
     */
    persisted = false;
  
    constructor(source?: IWriteable) {
      super(source);
      if (source) {
        Object.assign(this, source);
      }
    }
  }