import {GoogleAuth} from '../sync/google_drive/GoogleAuth';

export function useGoogleDrive() {
  async function signInWithGoogle(): Promise<boolean> {
    const googleAuth = new GoogleAuth();
    if (await googleAuth.hasUserAuthorized()) return true;

    await googleAuth.authorize();
    return googleAuth.hasUserAuthorized();
  }
}
