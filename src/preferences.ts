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

import { Reader, Io } from '@owid/io';
import { OWID, OWIDTarget } from '@owid/owid';
import { ISerializable } from './serializable';
import { IWriteable, Writeable } from './writeable';

/**
 * Preferences data without an associated OWID.
 */
export class PreferencesData {

    /**
     * True to indicate Personalized marketing, or false for Standard. See Model
     * Terms for meaning.
     */
    use_browsing_for_personalization: boolean;

    constructor(flag?: boolean) {
        this.use_browsing_for_personalization = flag === true;
    }

    fromByteArray(b: Reader) {
        this.use_browsing_for_personalization = Io.readByte(b) !== 0;
    }
}

/**
 * Preferences interface for use with JSON serialization.
 */
export interface IPreferences extends IWriteable {
    /**
     * Preference data.
     */
    data: PreferencesData;
}

/**
 * Preference data with an associated OWID. 
 */
export class Preferences extends Writeable implements OWIDTarget, ISerializable<Preferences> {

    /**
     * Preference data.
     */
    data: PreferencesData;

    /**
     * The OWID indicating the party that captured the preferences.
     */
    source: OWID<Preferences>;

    constructor(source?: IPreferences) {
        super(source);
        if (source) {
            Object.assign(this, source);
            this.source = new OWID<Preferences>(this, source.source);
        }
    }

    /**
     * Adds the target preference flag to the byte array as a single 0 or 1 byte.
     * @param b byte array to add the preference flag to
     */
    addOwidData(b: number[]) {
        super.addOwidData(b);
        Io.writeByte(b, this.data.use_browsing_for_personalization === true ? 1 : 0);
    }

    /**
     * Populates the members with the contents of the byte array.
     * @param b source byte array
     */
    fromByteArray(b: Reader): Preferences {
        super.fromByteArray(b);
        if (!this.data) {
            this.data = new PreferencesData();
        }
        this.data.fromByteArray(b);
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
    asInterface(): IPreferences {
        return {
            source: this.source?.asInterface(),
            version: this.version,
            persisted: this.persisted,
            data: this.data
        };
    }
}
