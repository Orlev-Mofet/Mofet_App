import React from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';
import {TextMont4Normal, TextMont7Bold, useLocale} from '../../../components';
import {useIntl} from 'react-intl';

export default function Welcome(): React.JSX.Element {
  const intl = useIntl();

  const {locale} = useLocale();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/welcome.png')}
        style={styles.image}
      />
      <TextMont7Bold style={styles.headerText}>
        {intl.formatMessage({id: `auth.label.welcome_to_mofet`})}
      </TextMont7Bold>
      <TextMont4Normal style={[styles.contentText]}>
        {intl.formatMessage({id: `lang.${locale}.welcome_to_mofet`})}
      </TextMont4Normal>
      <Image source={require('../../../../assets/images/step1.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 50,
  },
  image: {
    flex: 1,
    width: '80%',
    maxWidth: 340,
    maxHeight: 260,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 20,
    color: '#1485A3',
    textAlign: 'center',
  },
  contentText: {
    fontSize: 14,
    color: '#6A6A6A',
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 24,
    textAlign: 'left',
  },
});
