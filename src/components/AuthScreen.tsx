import React from 'react';
import {Alert} from 'react-native';
import FingerprintScanner, {Biometrics} from 'react-native-fingerprint-scanner';
import {Button, Text} from 'react-native-paper';

const AuthScreen = () => {
  const [biometryType, setBiometryType] = React.useState<Biometrics>();

  React.useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then(_biometryType => setBiometryType(_biometryType))
      .catch(e => {
        Alert.alert(`Please make sure fingureprint is enabled`);
      }); // TODO: show error in snackbar
  }, []);

  function getMessage() {
    if (biometryType == 'Face ID') {
      return 'Scan your Face on the device to continue';
    } else {
      return 'Scan your Fingerprint on the device scanner to continue';
    }
  }

  function showAuthenticationDialog() {
    if (biometryType !== null && biometryType !== undefined) {
      FingerprintScanner.authenticate({
        description: getMessage(),
      })
        .then(() => {
          //you can write your logic here to what will happen on successful authentication
        })
        .catch(error => {
          console.log('Authentication error is => ', error);
        });
    } else {
      console.log('biometric authentication is not available');
    }
  }

  // TODO: add useContext global authentication state
  // ask for authention on app launch, and don't allow user to access app if
  // they are not authenticated

  return (
    <>
      <Button onPress={showAuthenticationDialog}>Authenticate</Button>

      <Text>{`biometryType is  ${biometryType}`}</Text>
    </>
  );
};
export default AuthScreen;
