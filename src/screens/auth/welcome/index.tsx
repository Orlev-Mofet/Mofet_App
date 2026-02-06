import React, {useEffect, useState} from 'react';
import {StyleSheet, Button, View, Text, Platform} from 'react-native';
import {CustomButton, TextMont5Medium} from '../../../components';

import {useIntl} from 'react-intl';

import Welcome from './welcome';
import Question from './question';
import Verification from './verification';

export default function WelcomePage({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();

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

  return (
    <View style={styles.container}>
      <TextMont5Medium style={styles.textSkip} onPress={onSkipPressed}>
        {intl.formatMessage({id: 'auth.label.skip'})}
      </TextMont5Medium>
      <View style={styles.content}>
        {step === 1 && <Welcome />}
        {step === 2 && <Question />}
        {step === 3 && <Verification />}
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomButton}>
          <CustomButton
            title={intl.formatMessage({id: 'auth.label.Next'})}
            onPress={onPressedNext}
          />
        </View>
        <View style={styles.bottomLine}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  textSkip: {
    textAlign: 'right',
    fontSize: 16,
    padding: 20,
    lineHeight: 24,
    color: '#131313',
  },
  content: {
    flex: 1,
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 10,
  },
  bottomButton: {
    width: 200,
    marginVertical: 5,
  },
  bottomLine: {
    // height: 4,
    width: 126,
    borderRadius: 6,
    backgroundColor: '#2B2B2B',
  },
});
