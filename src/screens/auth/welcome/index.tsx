import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { CustomButton, TextMont5Medium, useLocale } from '../../../components';

import { useIntl } from 'react-intl';

import Welcome from './welcome';
import Question from './question';
import Verification from './verification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomePage({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const inset = useSafeAreaInsets();
  const { locale } = useLocale();

  const [step, setStep] = useState<number>(1);

  const onPressedNext = () => {
    if (step === 3) {
      navigation.push('agree');
    } else {
      setStep(step + 1);
    }
  };

  const onSkipPressed = () => {
    setStep(3);
    navigation.push('agree');
  };

  const isRTL = locale === 'he' || locale === 'ar';

  return (
    <View
      style={[
        styles.root,
        {
          direction: isRTL ? 'rtl' : 'ltr',
        },
      ]}
    >
      <View style={[styles.header, { paddingTop: inset.top }]}>
        <TextMont5Medium style={styles.textSkip} onPress={onSkipPressed}>
          {intl.formatMessage({ id: 'auth.label.skip' })}
        </TextMont5Medium>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && <Welcome />}
        {step === 2 && <Question />}
        {step === 3 && <Verification />}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: inset.bottom,
          },
        ]}
      >
        {step === 1 && (
          <Image source={require('../../../../assets/images/step1.png')} />
        )}
        {step === 2 && (
          <Image source={require('../../../../assets/images/step2.png')} />
        )}
        {step === 3 && (
          <Image source={require('../../../../assets/images/step3.png')} />
        )}
        <View style={styles.bottomButton}>
          <CustomButton
            title={intl.formatMessage({ id: 'auth.label.Next' })}
            onPress={onPressedNext}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingHorizontal: 20,
  },

  textSkip: {
    textAlign: 'right',
    fontSize: 16,
    lineHeight: 24,
    color: '#131313',
  },

  scrollContent: {
    flexGrow: 1,
    // paddingBottom: 100,
  },

  footer: {
    paddingTop: 10,
    gap: 12,
    alignItems: 'center',
  },

  bottomButton: {
    width: 200,
    marginVertical: 5,
  },
});
