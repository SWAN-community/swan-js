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
import { OWID } from '@owid/owid';
import { ISerializable } from './serializable';
import { IWriteable, Writeable } from './writeable';

/**
 * Salt interface for use with JSON serialization.
 */
export interface ISalt extends IWriteable {

    /**
     * The byte array value
     */
    salt: string;
}

/**
 * Salt used to hash with the email address to form the SID.
 */
export class Salt extends Writeable implements ISalt, ISerializable<Salt> {

    /**
     * The byte array value
     */
    salt: string;

    /**
     * OWID associated with the byte array.
     */
    source: OWID<Salt>;

    /**
     * Returns the value as a byte array for crypto operations.
     */
    get saltAsByteArray(): Uint8Array {
        return Uint8Array.from(atob(this.salt), c => c.charCodeAt(0));
    }

    /**
     * Adds the data needed for the OWID signing and verification.
     */
    addOwidData(b: number[]) {
        super.addOwidData(b);
        Io.writeByteArrayNoLength(b, this.saltAsByteArray);
    }

    /**
     * Populates the members with the contents of the byte array.
     * @param b source byte array
     * @returns this salt
     */
     fromByteArray(b: Reader): Salt {
        super.fromByteArray(b);
        this.salt = Io.readString(b);
        if (!this.source) {
            this.source = new OWID(this);
        }
        this.source.fromByteArray(b);
        return this;
    }

    /**
     * A fresh instance of the interface for serialization.
     * @returns 
     */
    asInterface(): ISalt {
        return {
            source: this.source?.asInterface(),
            version: this.version,
            persisted: this.persisted,
            salt: this.salt
        };
    }
}
