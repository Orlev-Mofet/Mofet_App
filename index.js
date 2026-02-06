/**
 * @format
 */

import {AppRegistry, Text, TextInput, LogBox} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer from 'react-native-track-player';

import App from './src/App';
import {name as appName} from './app.json';
import {playbackService} from './trackPlayerServices';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
// Register background handler
async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}
requestUserPermission();

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
console.disableYellowBox = true;
