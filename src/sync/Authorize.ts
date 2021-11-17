export interface Authorize {
  authorize(): Promise<void>;
  revokeAuthorization(): Promise<void>;
  hasUserAuthorized(): Promise<boolean>;
}
