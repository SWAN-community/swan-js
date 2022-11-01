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

import { OWID } from '../owid-js/src/owid';
import { Identifier, IIdentifier } from './identifier';

/**
 * Random ID. See Model Terms for details.
 */
export class Rid extends Identifier<Rid> {

  protected createSource(): OWID<Rid> {
    return new OWID<Rid>(this);
  }

  constructor(source?: IIdentifier) {
    super(source);
    this.source = new OWID<Rid>(this, source?.source);
  }
}