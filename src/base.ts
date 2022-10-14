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

import { Io, Reader } from '@owid/io';

/**
 * Version number as a positive integer.
 */
export type Version = number;

export interface IBase {

    /**
     * Indicates the version for the entity.
     */
    version: Version;
}

/**
 * Base class used for all entities that can be signed.
 */
export class Base implements IBase {

    /**
     * Indicates the version for the entity.
     */
    version: Version = 1;

    /**
     * True if the OWID related to the entity has been verified with the signer. 
     * This must be reset if any other fields associated with the entity are
     * changed.
     */
    verified = false;

    constructor(source?: IBase) {
        if (source) {
            Object.assign(this, source);
        }
    }

    addOwidData(b: number[]) {
        Io.writeByte(b, this.version);
    }

    fromByteArray(b: Reader) {
        this.version = Io.readByte(b);
    }
}