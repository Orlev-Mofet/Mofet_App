import React, { useState, useEffect, useRef } from 'react';
import {
  I18nManager,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { useIntl } from 'react-intl';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CustomButton,
  TextMont4Normal,
  TextPopp4Regular,
  useLocale,
  useUser,
} from '../../components';

import { Controller, useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import { RegisterWithEmailSchema } from '../../validationSchemas/authSchemas';
import { storeFetchData } from '../../utils/fetchData';
import { storeStorageData } from '../../utils/localStorage';
import { SK_TOKEN } from '../../utils/constants';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterWithEmail({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const { locale } = useLocale();
  const { setUserData } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(RegisterWithEmailSchema),
  });
  const onSubmit = async (data: FormData) => {
    await messaging().registerDeviceForRemoteMessages();
    const _fcmToken = await messaging().getToken();
    // const newUser = new FormData();
    // newUser.append('email', data.email);
    // newUser.append('password', data.password);
    // newUser.append('fcm', _fcmToken);
    const res = await storeFetchData('signup', {
      email: data.email,
      password: data.password,
      fcm: _fcmToken,
    });
    if (res.status === 'success') {
      await storeStorageData(SK_TOKEN, res?.token);
      setUserData(res?.user);
      navigation.navigate('main');
    }
  };

  const termsConditionPressed = () => {
    navigation.navigate('privacy_policy');
  };

  const privacyPolicyPressed = () => {
    navigation.navigate('privacy_policy');
  };
  const onBackPressed = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={{ width: '100%' }}>
            <Pressable
              style={{ position: 'absolute', zIndex: 100, left: 30, top: 30 }}
              onPress={onBackPressed}
            >
              <Image
                source={require('../../../assets/images/back-icon.png')}
                style={styles.backIcon}
              />
            </Pressable>
            <View style={styles.imageContainer}>
              <Image
                style={{ height: 100, width: 100, objectFit: 'contain' }}
                source={require('../../../assets/images/logo2.png')}
              />
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {/* <TextMont4Normal style={styles.numberText}>
            {intl.formatMessage({id: 'auth.label.EnterMobileNumber'})}
            Sign up with email
          </TextMont4Normal> */}
          <View style={styles.formContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textInputNormal}
                  placeholder="Email"
                  autoCapitalize="none"
                  placeholderTextColor="#6d6d6d"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            <TextPopp4Regular style={styles.error}>
              {errors.email?.message}
            </TextPopp4Regular>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textInputNormal}
                  placeholder="Password"
                  placeholderTextColor="#6d6d6d"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            <TextPopp4Regular style={styles.error}>
              {errors.password?.message}
            </TextPopp4Regular>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textInputNormal}
                  placeholderTextColor="#6d6d6d"
                  placeholder="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
              name="confirmPassword"
            />
            <TextPopp4Regular style={styles.error}>
              {errors.confirmPassword?.message}
            </TextPopp4Regular>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.textContainer2}>
              <TextPopp4Regular style={styles.black}>
                Already have an account ?{' '}
              </TextPopp4Regular>
              <TextPopp4Regular
                style={styles.textUnderline}
                onPress={() => navigation.navigate('loginWithEmail')}
              >
                Sign in
              </TextPopp4Regular>
            </View>
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
                  type
                  onPress={privacyPolicyPressed}
                >
                  {intl.formatMessage({ id: 'auth.label.Privacy_policy' })}
                </TextPopp4Regular>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomButton}>
            <CustomButton
              //   title={intl.formatMessage({id: 'auth.label.Register'})}
              title={'Sign Up'}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  logo: {
    width: 160,
    height: 35,
  },
  backIcon: {
    width: 35,
    height: 35,
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
  formContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    gap: 5,
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

  chevron: {
    marginRight: I18nManager.isRTL ? 0 : 10,
    marginVertical: I18nManager.isRTL ? 10 : 0,
  },
  black: {
    color: '#000000',
    fontSize: 11,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  error: {
    color: '#f44444',
    fontSize: 11,
    alignSelf: 'flex-start',
    textAlign: 'left',
    flexWrap: 'wrap',
    paddingVertical: 0,
    paddingHorizontal: 22,
    minHeight: 18,
  },

  textContainer: {
    justifyContent: 'center',
    alignContent: 'center',
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
  textInputNormal: {
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 6,
    width: '90%',
    textAlign: 'left',
    color: '#000',
    fontSize: 16,
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
});
