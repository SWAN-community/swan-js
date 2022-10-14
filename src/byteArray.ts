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

import { Io } from '@owid/io';
import { OWID } from '@owid/owid';
import { IWriteable, Writeable } from './writeable';

/**
 * Byte array interface for use with JSON serialization.
 */
export interface IByteArray extends IWriteable {

    /**
     * The byte array value as a base 64 string.
     */
    value: string;
}

/**
 * Any byte array that might be signed with an OWID. For example; the hash of 
 * the email and the pass code.
 */
export class ByteArray extends Writeable implements IByteArray {

    /**
     * The byte array value as a base 64 string.
     */
    value: string;

    /**
     * OWID associated with the byte array.
     */
    source: OWID<ByteArray>;

    /**
     * Returns the value as a byte array for crypto operations.
     */
    get valueAsByteArray(): Uint8Array {
        return Uint8Array.from(atob(this.value), c => c.charCodeAt(0));
    }

    constructor(source?: IByteArray) {
        super(source);
        if (source) {
            Object.assign(this, source);
            this.source = new OWID<ByteArray>(this, source.source);
        }
    }

    /**
     * Adds the data needed for the OWID signing and verification.
     */
    addOwidData(b: number[]) {
        super.addOwidData(b);
        Io.writeByteArray(b, this.valueAsByteArray);
    }

    /**
     * A fresh instance of the interface for serialization.
     * @returns 
     */
    asInterface(): IByteArray {
        return {
            source: this.source?.asInterface(),
            version: this.version,
            persisted: this.persisted,
            value: this.value
        };
    }
}
