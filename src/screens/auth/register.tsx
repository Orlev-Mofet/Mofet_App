import React, { useState, useEffect, useRef } from 'react';
import { I18nManager, Platform, Text } from 'react-native';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import { useIntl } from 'react-intl';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js';

import CountryFlag from 'react-native-country-flag';
import { CountryPicker } from 'react-native-country-codes-picker';

import {
  SK_AGREE_POLICY,
  SK_PHONE_INFO,
  ST_ERROR,
  ST_SUCCESS,
} from '../../utils/constants';

import {
  CustomButton,
  CustomDivider,
  TextMont4Normal,
  TextPopp4Regular,
  useLocale,
} from '../../components';
import { storeFetchData, getFetchData } from '../../utils/fetchData';
import { storeStorageData, getStorageData } from '../../utils/localStorage';

import { getHash } from 'react-native-otp-verify';
import Toast from 'react-native-toast-message';

export default function Register({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const { locale } = useLocale();

  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneCode, setPhoneCode] = useState('+972');
  const [regionCode, setRegionCode] = useState<string>('IL');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageData = await getStorageData(SK_PHONE_INFO);
        const objData = storageData && JSON.parse(storageData);
        if (
          objData &&
          objData.country_code &&
          objData.phone_code &&
          objData.phone_number
        ) {
          setPhoneNumber(objData.phone_number);
          setPhoneCode(objData.phone_code);
          setRegionCode(objData.country_code);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getHash()
      .then((h: string[]) => {
        if (h.length > 0) {
          setHash(h[0]);
        }
      })
      .catch(console.log);

    fetchData();
  }, []);

  const onPressedRegister = async () => {
    if (isFetching) return;

    const data = {
      country_code: regionCode,
      phone_code: phoneCode,
      phone_number: phoneNumber,
    };

    const phoneInfo = parsePhoneNumber(
      phoneCode + phoneNumber,
      regionCode as CountryCode,
    );

    if (!phoneInfo || !phoneInfo.isValid()) {
      ToastAndroid.show(
        intl.formatMessage({ id: `lang.${locale}.phone_number_is_invalid` }),
        ToastAndroid.SHORT,
      );
      return;
    }
    setIsFetching(true);

    try {
      const res = await storeFetchData('register', data);
      console.log(res, 'res');

      if (res) {
        // save to local storage
        await storeStorageData(SK_PHONE_INFO, JSON.stringify(data));

        if (res.status === ST_ERROR) {
          const keys = Object.keys(res.errors);
          if (keys.length) {
            ToastAndroid.show(res.errors[keys[0]][0], ToastAndroid.SHORT);
          }
        }

        // send OTP
        const res2 = await getFetchData(
          `sendOTP?phone_number=${phoneCode}${phoneNumber}&hash=${hash}`,
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
        setIsFetching(false);
        navigation.navigate('verify');
      }
    } catch (error: any) {
      setIsFetching(false);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const termsConditionPressed = () => {
    navigation.navigate('privacy_policy');
  };

  const privacyPolicyPressed = () => {
    navigation.navigate('privacy_policy');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 100, width: 100, objectFit: 'contain' }}
            source={require('../../../assets/images/logo2.png')}
          />
        </View>
        <TextMont4Normal style={styles.numberText}>
          {intl.formatMessage({ id: 'auth.label.EnterMobileNumber' })}
        </TextMont4Normal>
        <View style={styles.verifyContainer}>
          <View>
            <CountryFlag isoCode={regionCode} size={22} />
          </View>

          <TouchableOpacity
            onPress={() => setShow(true)}
            style={styles.countryCodeContainer}
          >
            <TextMont4Normal style={styles.countryCode}>
              {phoneCode}
            </TextMont4Normal>
          </TouchableOpacity>

          <CountryPicker
            show={show}
            lang={locale}
            pickerButtonOnPress={(item: any) => {
              setPhoneCode(item.dial_code);
              setRegionCode(item.code);
              setShow(false);
            }}
            searchMessage="search"
            style={{
              modal: {
                height: 500,
              },
            }}
          />

          <Image
            source={require('../../../assets/images/chevron-down.png')}
            style={styles.chevron}
          />

          <CustomDivider orientation="vertical" />

          <TextInput
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            style={styles.phoneInput}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('registerWithEmail')}
        >
          <TextPopp4Regular style={styles.textUnderline}>
            Sign in with E-mail
          </TextPopp4Regular>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <TextPopp4Regular style={styles.black}>
            {intl.formatMessage({ id: 'auth.label.byContinuing' })}
          </TextPopp4Regular>
          <View style={styles.textContainer2}>
            <TextPopp4Regular
              style={styles.textUnderline}
              onPress={termsConditionPressed}
            >
              {intl.formatMessage({ id: 'auth.label.Terms_condition' })}
            </TextPopp4Regular>
            <TextPopp4Regular style={styles.black}>
              {intl.formatMessage({ id: 'auth.label.and' })}
            </TextPopp4Regular>
            <TextPopp4Regular
              style={styles.textUnderline}
              onPress={privacyPolicyPressed}
            >
              {intl.formatMessage({ id: 'auth.label.Privacy_policy' })}
            </TextPopp4Regular>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomButton}>
          <CustomButton
            title={intl.formatMessage({ id: 'auth.label.Register' })}
            onPress={onPressedRegister}
            isLoading={isFetching}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
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
  verifyContainer: {
    width: '85%',
    display: 'flex',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#707070',
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 0,
  },
  numberText: {
    width: '80%',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'left',
  },
  countryCodeContainer: {
    width: '20%',
    height: 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  countryCode: {
    flex: 1,
    color: '#000000',
    alignContent: 'center',
    justifyContent: 'center',
    fontSize: 16,
    paddingTop: 23,
    lineHeight: 18,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
  },
  chevron: {
    marginRight: 10,
    marginLeft: 10,
  },
  black: {
    color: '#000000',
    fontSize: 11,
    textAlign: 'center',
    flexWrap: 'wrap',
  },

  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '80%',
  },
  textContainer2: {
    flexDirection: 'row',
  },
  textUnderline: {
    textDecorationLine: 'underline',
    color: '#015A80',
    fontSize: 11,
  },

  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    marginBottom: 30,
  },
  bottomButton: {
    width: '80%',
  },
});
