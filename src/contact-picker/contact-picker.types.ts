export interface ContactPickerValue {
  /** unique id in the underlying reference system */
  id: string;
  /** full name */
  name: string;
  /** first name */
  firstName?: string;
  /** last name */
  lastName?: string;
  /** email */
  email?: string;
  /** publicly known user identifier */
  userName?: string;
  /** authentication domain for this user */
  domain?: string;
  /** URL to a picture representing this user */
  avatarUrl?: string;
}
