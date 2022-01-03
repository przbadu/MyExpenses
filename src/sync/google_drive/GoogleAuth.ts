import {Authorize} from '../Authorize';

export class GoogleAuth implements Authorize {
  constructor() {}

  authorize(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  revokeAuthorization(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  hasUserAuthorized(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
