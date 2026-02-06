import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  I18nManager,
  ToastAndroid,
} from 'react-native';
import * as Progress from 'react-native-progress';

import {useIntl} from 'react-intl';

import {
  APP_VERSION,
  SK_AGREE_POLICY,
  SK_OTP_CODE,
  SK_PHONE_INFO,
  SK_TOKEN,
} from '../../utils/constants';

import {getStorageData, storeStorageData} from '../../utils/localStorage';
import {getFetchData} from '../../utils/fetchData';
import {useLocale, TextMont4Normal, useUser} from '../../components';

export default function SplashScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const {addMessages, setConstantData} = useLocale();
  const {setUserData} = useUser();

  const intl = useIntl();
  const [count, setCount] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLang, setIsLang] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await getFetchData(`language`);
        if (result && result.status === 'success') {
          let newLang = {};
          for (const iterator of result.languages) {
            newLang = {...newLang, ...iterator};
          }
          let constants = {};
          for (const iterator of result.constants) {
            constants = {...constants, ...iterator};
          }
          setIsLang(true);
          addMessages(newLang);
          setConstantData(constants);
          setCount(60);
        }

        const otpCode = await getStorageData(SK_OTP_CODE);
        if (otpCode) {
          const storeData = await getStorageData(SK_PHONE_INFO);
          const phoneData = storeData && JSON.parse(storeData);
          const otpData = otpCode && JSON.parse(otpCode);
          console.log(otpData, 'otp data');
          const otpResult = await getFetchData(
            `checkOTP?otp=${otpData?.otpCode}&phone_number=${phoneData.phone_code}${phoneData.phone_number}&fcm_token=${otpData?.fcmToken}`,
          );

          if (otpResult?.status === 'success') {
            await storeStorageData(SK_TOKEN, otpResult?.token);
            setUserData(otpResult?.user);
            // setCount(100);
            navigation.navigate('main');
          }
        } else {
          setCount(100);
        }
      } catch (error: any) {
        setIsLang(false);
        setCount(100);
        navigation.navigate('register');
        console.log('error......', error);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const navigationPage = async () => {
      try {
        const agree_policy = await getStorageData(SK_AGREE_POLICY);
        if (Number(agree_policy)) {
          navigation.navigate('register');
        } else {
          navigation.navigate('welcome');
        }
      } catch (error) {
        navigation.navigate('welcome');
      }
    };

    if (count >= 100 && isLang) {
      navigationPage();
    } else if (count > 100 && !isLang) {
      ToastAndroid.show('Please check the net status.', ToastAndroid.SHORT);
    } else {
      if (count < 50) {
        setTimeout(() => {
          setCount(old => old + 20);
        }, 500);
      }
    }
  }, [count]);

  return (
    <ImageBackground
      source={require('../../../assets/images/Splash.png')}
      style={[styles.image]}>
      <View style={[styles.container]}>
        <View style={styles.content}>
          <Image source={require('../../../assets/images/logo.png')} />
          <Image source={require('../../../assets/images/logo-text.png')} />
          <Progress.Bar
            progress={count / 100}
            width={157}
            color="#FFFFFF"
            unfilledColor="rgba(255, 255, 255, 0.2)"
            borderColor="transparent"
            style={styles.progressBar}
          />
        </View>

        <View style={styles.bottom}>
          <View style={styles.bottomText}>
            <TextMont4Normal style={styles.text}>
              {intl.formatMessage({id: 'auth.label.copyright'}, {year: year})}
            </TextMont4Normal>
            <TextMont4Normal style={styles.text}>
              {intl.formatMessage(
                {id: 'auth.label.version'},
                {version: APP_VERSION},
              )}
            </TextMont4Normal>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#015A80',
    opacity: 0.9,
    flex: 1,
  },
  content: {
    height: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  progressBar: {
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },

  bottom: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 18,
  },
  bottomText: {},
  text: {
    fontFamily: 'Poppins',
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
