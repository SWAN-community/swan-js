import { Io, Reader } from '../owid-js/src/io';

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
