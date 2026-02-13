/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import { I18nManager } from 'react-native';
import { IntlProvider } from 'react-intl';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  useLocale,
  LocaleProvider,
  UserProvider,
  QuestionProvider,
} from './components';
import LoadingScreen from './screens/loading';
import SplashScreen from './screens/auth/splash';
import WelcomePage from './screens/auth/welcome';
import Agree from './screens/auth/agree';
import Register from './screens/auth/register';
import Verify from './screens/auth/verify';
import MainPage from './screens/main';
import PrivacyAndPolicy from './screens/privacy_policy';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import RegisterWithEmail from './screens/auth/registerWithEmail';
import LoginWithEmail from './screens/auth/loginWithEmail';
const Stack = createStackNavigator();

function LocalizationWrapper() {
  return (
    <LocaleProvider>
      <UserProvider>
        <QuestionProvider>
          <App />
        </QuestionProvider>
      </UserProvider>
    </LocaleProvider>
  );
}
export default LocalizationWrapper;

function App(): React.JSX.Element {
  const { locale, direction, messages } = useLocale();

  useEffect(() => {
    if (direction === 'rtl' && !I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }

    if (direction === 'ltr' && I18nManager.isRTL) {
      I18nManager.forceRTL(false);
    }
  }, [direction]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            header: () => null,
          }}
        >
          <Stack.Screen name="loading" component={LoadingScreen} />
          <Stack.Screen name="splash" component={SplashScreen} />
          <Stack.Screen name="welcome" component={WelcomePage} />
          <Stack.Screen name="agree" component={Agree} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen
            name="registerWithEmail"
            component={RegisterWithEmail}
          />
          <Stack.Screen name="loginWithEmail" component={LoginWithEmail} />
          <Stack.Screen name="verify" component={Verify} />
          <Stack.Screen name="main" component={MainPage} />
          <Stack.Screen name="privacy_policy" component={PrivacyAndPolicy} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </IntlProvider>
  );
}
