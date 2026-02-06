import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useIntl} from 'react-intl';

import {CustomButton, TextMont4Normal, useLocale} from '../../components';

export default function PrivacyAndPolicy({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const {locale, messages} = useLocale();

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onConfirmPressed = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBackPressed}>
          <Image
            source={require('../../../assets/images/back-icon.png')}
            style={styles.backIcon}
          />
        </Pressable>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo-h.png')}
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <TextMont4Normal style={styles.headerText}>
          {intl.formatMessage({id: 'label.main.privacy_policy'})}{' '}
        </TextMont4Normal>
        <ScrollView>
          <TextMont4Normal style={[styles.contentText]}>
            {intl.formatMessage({id: `lang.${locale}.terms_and_policy`})}
          </TextMont4Normal>
        </ScrollView>
      </View>

      <View style={styles.bottom}>
        <View style={styles.bottomButton}>
          <CustomButton
            title={intl.formatMessage({id: 'label.main.comfirm'})}
            onPress={onConfirmPressed}
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
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    paddingRight: 80,
    width: '100%',
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 35,
  },

  contentContainer: {
    flex: 1,
    marginTop: 30,
  },
  headerText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
    marginBottom: 15,
  },
  contentText: {
    color: '#677181',
    fontSize: 12,
    lineHeight: 23,
    paddingLeft: 10,
    textAlign: 'left',
  },
  scrollViewContent: {},

  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingVertical: 10,
    marginBottom: 5,
  },
  bottomButton: {
    width: '80%',
  },
  bottomLine: {
    // height: 4,
    width: 126,
    borderRadius: 6,
    backgroundColor: '#2B2B2B',
  },
});
