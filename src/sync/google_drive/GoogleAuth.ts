import {Authorize} from '../Authorize';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {GOOGLE_AUTH_CONFIG} from './GoogleAuthConfig';

export class GoogleAuth implements Authorize {
  constructor() {
    GoogleSignin.configure({
      scopes: GOOGLE_AUTH_CONFIG.scopes,
      webClientId: GOOGLE_AUTH_CONFIG.clientId,
    });
  }

  async authorize(): Promise<void> {
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
    } catch (error: any) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign in in-progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play services not available or outdated');
      } else {
        alert(error.message);
      }
    }
  }

  async revokeAuthorization(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  }

  async hasUserAuthorized(): Promise<boolean> {
    return await GoogleSignin.isSignedIn();
  }
}
