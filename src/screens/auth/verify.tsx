import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ToastAndroid,
  I18nManager,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import {
  getHash,
  removeListener,
  startOtpListener,
} from 'react-native-otp-verify';
import messaging from '@react-native-firebase/messaging';

import { useIntl } from 'react-intl';

import {
  SK_OTP_CODE,
  SK_PHONE_INFO,
  SK_TOKEN,
  ST_ERROR,
} from '../../utils/constants';

import {
  CustomButton,
  TextMont4Normal,
  useUser,
  useLocale,
} from '../../components';

import { getFetchData } from '../../utils/fetchData';
import { getStorageData, storeStorageData } from '../../utils/localStorage';

export default function Verify({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const { setUserData } = useUser();
  const { locale } = useLocale();
  const otpTextViewRef = useRef<OTPTextView>(null);

  const [counter, setCounter] = useState<string>('0:00');
  const [remainSec, setRemainSec] = useState<number>(60);
  const [otpVerified, setOtpVerified] = useState<number>(2);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fcmToken, setFcmToken] = useState<string>('');
  const [hash, setHash] = useState<string>('');

  const onVerifyPressed = async () => {
    setOtpVerified(2);

    if (isFetching) return;

    if (otpCode?.length !== 4) {
      ToastAndroid.show(
        intl.formatMessage({ id: `lang.${locale}.please_input_correct_otp` }),
        ToastAndroid.SHORT,
      );
      return;
    }

    const storeData = await getStorageData(SK_PHONE_INFO);
    const phoneData = storeData && JSON.parse(storeData);

    try {
      setIsFetching(true);
      const res = await getFetchData(
        `checkOTP?otp=${otpCode}&phone_number=${phoneData.phone_code}${phoneData.phone_number}&fcm_token=${fcmToken}`,
      );
      setIsFetching(false);
      if (res && res.status === 'success') {
        await storeStorageData(SK_TOKEN, res.token);
        await storeStorageData(
          SK_OTP_CODE,
          JSON.stringify({ otpCode: otpCode, fcmToken: fcmToken }),
        );
        setUserData(res?.user);

        setOtpVerified(1);

        setTimeout(function () {
          navigation.navigate('main');
        }, 200);
      } else {
        setOtpVerified(0);
      }
    } catch (error) {
      setOtpVerified(0);
      setIsFetching(false);
    }
  };

  const handleOTPChange = (val: string) => {
    setOtpCode(val);
    if (val.length === 4) {
      Keyboard.dismiss();
    }
  };

  const resendOTP = async () => {
    if (!!remainSec) return;

    try {
      const storageData = await getStorageData(SK_PHONE_INFO);
      const phoneData = storageData && JSON.parse(storageData);
      // send OTP
      const res2 = await getFetchData(
        `sendOTP?phone_number=${phoneData?.phone_code}${phoneData?.phone_number}&hash=${hash}`,
      );
      if (!res2 || (res2 && res2.status === ST_ERROR)) {
        ToastAndroid.show(
          intl.formatMessage({
            id: `lang.${locale}.cant_send_otp_to_your_phone`,
          }),
          ToastAndroid.SHORT,
        );
        setIsFetching(false);
        return;
      }

      setRemainSec(60);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const numberToMss = (number: number) => {
    const minutes = Math.floor(number / 60);
    const seconds = number % 60;

    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    getHash()
      .then((h: string[]) => {
        if (h.length > 0) {
          setHash(h[0]);
        }
      })
      .catch(console.log);

    const checkToken = async () => {
      const _fcmToken = await messaging().getToken();
      if (_fcmToken) {
        setFcmToken(_fcmToken);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    setCounter(numberToMss(remainSec));

    if (0 < remainSec) {
      setTimeout(() => {
        setRemainSec(prev => prev - 1);
      }, 1000);
    }

    if (remainSec % 10 === 0) {
      removeListener();

      startOtpListener((resp: string) => {
        const regex: any = /\b\d{4}\b/g;
        const matches: any = resp.match(regex);
        if (matches !== null && matches.length > 0) {
          const otp: any = matches[0];
          setOtpCode(otp);
          if (otpTextViewRef && otpTextViewRef.current) {
            otpTextViewRef.current.setValue(otp);
          }
        }
      }).catch((err: any) => {
        console.log('error: otp auto read: ', err);
      });
    }
  }, [remainSec]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={{ height: 100, width: 100, objectFit: 'contain' }}
              source={require('../../../assets/images/logo2.png')}
            />
          </View>
          <TextMont4Normal style={styles.numberText}>
            {intl.formatMessage({ id: 'auth.label.loginText' })}
          </TextMont4Normal>

          <View style={styles.otpContainer}>
            <OTPTextView
              textInputStyle={styles.OTPTextInputStyle}
              handleTextChange={handleOTPChange}
              ref={otpTextViewRef}
            />
          </View>

          <View style={styles.countContainer}>
            <TextMont4Normal style={styles.fontBlack}>
              {intl.formatMessage({ id: 'auth.label.receive_code_yet' })}
            </TextMont4Normal>
            <TextMont4Normal style={styles.fontBlack}>
              {intl.formatMessage({ id: 'auth.label.wait_for' })}
            </TextMont4Normal>
            <TextMont4Normal style={styles.counter} onPress={() => resendOTP()}>
              {!!remainSec && counter}
              {!!!remainSec &&
                intl.formatMessage({ id: `lang.${locale}.otp_resend` })}
            </TextMont4Normal>
          </View>

          {otpVerified < 2 && (
            <View
              style={
                otpVerified
                  ? styles.OTPStatusPanelSuccess
                  : styles.OTPStatusPanelError
              }
            >
              <TextMont4Normal
                style={otpVerified ? styles.TextSuccess : styles.TextError}
              >
                {otpVerified
                  ? intl.formatMessage({ id: 'auth.label.OTP_Verified' })
                  : intl.formatMessage({
                      id: 'auth.label.OTP_Invalid_or_Expired',
                    })}
              </TextMont4Normal>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <View style={styles.bottomButton}>
            <CustomButton
              title={intl.formatMessage({ id: 'auth.label.Verify' })}
              onPress={onVerifyPressed}
              isLoading={isFetching}
            />
          </View>
          <View style={styles.bottomLine}></View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 15,
    alignItems: 'center',
  },
  numberText: {
    width: '80%',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  otpContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },

  OTPTextInputStyle: {
    backgroundColor: 'transparent',
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 1,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },

  countContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'center',
  },
  fontBlack: {
    color: '#000000',
    fontSize: 12,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  counter: {
    color: '#087A99',
    fontSize: 12,
    lineHeight: 18,
    minWidth: 30,
  },

  OTPStatusPanelError: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 15,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
  },
  TextError: {
    color: '#FF0000',
    fontSize: 14,
  },
  OTPStatusPanelSuccess: {
    backgroundColor: '#rgba(20, 133, 163, 0.2)',
    padding: 15,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
  },
  TextSuccess: {
    color: '#1485A3',
    fontSize: 14,
  },

  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    paddingBottom: 10,
  },
  bottomButton: {
    width: '80%',
  },
  bottomLine: {
    height: 4,
    width: 126,
    borderRadius: 6,
    backgroundColor: '#2B2B2B',
  },
});
