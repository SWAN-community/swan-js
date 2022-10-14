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
import { OWIDTarget, OWID } from '@owid/owid';
import { IByteArray } from './byteArray';
import { ISerializable } from './serializable';
import { Writeable } from './writeable';

/**
 * Possible types of identifier.
 */
export enum IdentifierType {
    rid = 'rid', // Random ID as defined in the Model Terms
    sid = 'sid' // Signed in ID from the hash of the email and salt
}

/**
 * Identifier interface for use with JSON serialization.
 */
export interface IIdentifier extends IByteArray {

    /**
     * The identifier type.
     */
    idType: IdentifierType;
}

/**
 * Identifier associated with an OWID.
 */
export class Identifier extends Writeable implements OWIDTarget, IIdentifier, ISerializable<Identifier> {

    /**
     * The identifier type.
     */
    idType: IdentifierType;

    /**
     * OWID associated with the identifier.
     */
    source: OWID<Identifier>;

    /**
     * Value as a byte array
     */
    private valueArray: Uint8Array;

    /**
     * The identifier value as a base 64 string
     */
    public get value(): string {
        return Io.byteArrayToBase64(this.valueArray);
    }
    public set value(value: string) {
        this.valueArray = Uint8Array.from(atob(value), c => c.charCodeAt(0));
    }

    constructor(source?: IIdentifier) {
        super(source);
        if (source) {
            Object.assign(this, source);
            this.source = new OWID<Identifier>(this, source.source);
        }
    }

    /**
     * Populates the members with the contents of the byte array.
     * @param b source byte array
     * @returns this identifier
     */
    fromByteArray(b: Reader): Identifier {
        super.fromByteArray(b);
        this.idType = Io.readString(b) as IdentifierType;
        this.valueArray = Io.readByteArray(b);
        if (!this.source) {
            this.source = new OWID(this);
        }
        this.source.fromByteArray(b);
        return this;
    }

    /**
     * Adds the data needed for the OWID signing and verification.
     */
    addOwidData(b: number[]) {
        super.addOwidData(b);
        Io.writeString(b, this.idType);
        Io.writeByteArray(b, this.valueArray);
    }

    /**
     * Printable version of the value.
     * @returns 
     */
    asPrintable(): string {
        return this.toHexString(this.valueArray);
    }

    /**
     * A fresh instance of the interface for serialization.
     * @returns 
     */
    asInterface(): IIdentifier {
        return {
            source: this.source?.asInterface(),
            version: this.version,
            persisted: this.persisted,
            value: this.value,
            idType: this.idType
        };
    }

    private toHexString(byteArray: Uint8Array) {
        let s = '';
        byteArray.forEach((byte) => {
          s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
        });
        return s;
      }
}
