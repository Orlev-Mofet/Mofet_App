import React, {useState, useEffect, useRef} from 'react';
import {I18nManager, Keyboard, Platform, Pressable, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {useIntl} from 'react-intl';
import {zodResolver} from '@hookform/resolvers/zod';

import {
  CustomButton,
  TextMont4Normal,
  TextPopp4Regular,
  useLocale,
  useUser,
} from '../../components';

import {Controller, useForm} from 'react-hook-form';
import Button from '../../components/ui/Button';
import {RegisterWithEmailSchema} from '../../validationSchemas/authSchemas';
import {storeFetchData} from '../../utils/fetchData';
import {storeStorageData} from '../../utils/localStorage';
import {SK_TOKEN} from '../../utils/constants';

type FormData = {
  email: string;
  password: string;
};

export default function LoginWithEmail({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const {locale} = useLocale();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const {setUserData} = useUser();

  const onSubmit = async (data: FormData) => {
    const res = await storeFetchData('signin', {
      email: data.email,
      password: data.password,
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
          <View style={{width: '100%'}}>
            <Pressable
              style={{position: 'absolute', zIndex: 100, left: 30, top: 30}}
              onPress={onBackPressed}>
              <Image
                source={require('../../../assets/images/back-icon.png')}
                style={styles.backIcon}
              />
            </Pressable>
            <View style={styles.imageContainer}>
              <Image
                style={styles.logo}
                source={require('../../../assets/images/logo-h.png')}
              />
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.textInputNormal}
                  placeholder="Email"
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
              rules={{
                maxLength: 100,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.textInputNormal}
                  placeholder="Password"
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
          </View>

          <View style={styles.textContainer}>
            <TextPopp4Regular style={styles.black}>
              {intl.formatMessage({id: 'auth.label.byContinuing'})}
            </TextPopp4Regular>
            <View style={styles.textContainer2}>
              <TextPopp4Regular
                style={styles.textUnderline}
                onPress={termsConditionPressed}>
                {intl.formatMessage({id: 'auth.label.Terms_condition'})}
              </TextPopp4Regular>
              <TextPopp4Regular style={styles.black}>
                {intl.formatMessage({id: 'auth.label.and'})}
              </TextPopp4Regular>
              <TextPopp4Regular
                style={styles.textUnderline}
                onPress={privacyPolicyPressed}>
                {intl.formatMessage({id: 'auth.label.Privacy_policy'})}
              </TextPopp4Regular>
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomButton}>
            <CustomButton
              //   title={intl.formatMessage({id: 'auth.label.Register'})}
              title={'Sign in'}
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
  backIcon: {
    width: 40,
    height: 40,
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
