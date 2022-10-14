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
 * Email interface for use with JSON serialization.
 */
export interface IEmail extends IWriteable {

    /**
     * The byte array value
     */
    value: string;
}

/**
 * Raw email address.
 */
export class Email extends Writeable implements IEmail, ISerializable<Email> {

    /**
     * The byte array value
     */
    value: string;

    /**
     * OWID associated with the email.
     */
    source: OWID<Email>;

    constructor(source?: IEmail) {
        super(source);
        if (source) {
            Object.assign(this, source);
            this.source = new OWID<Email>(this, source.source);
        }
    }

    /**
     * Populates the members with the contents of the byte array.
     * @param b source byte array
     * @returns this email
     */
    fromByteArray(b: Reader): Email {
        super.fromByteArray(b);
        this.value = Io.readString(b);
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
        Io.writeString(b, this.value);
    }

    /**
     * A fresh instance of the interface for serialization.
     * @returns 
     */
    asInterface(): IEmail {
        return {
            source: this.source?.asInterface(),
            version: this.version,
            persisted: this.persisted,
            value: this.value
        };
    }
}