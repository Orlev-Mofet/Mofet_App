import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';

import { storeStorageData } from '../../../utils/localStorage';
import { SK_RESTART_TIME } from '../../../utils/constants';
import { useLocale, useUser, PersonalSettingModal } from '../../../components';
import SelectDropdown from 'react-native-select-dropdown';

export default function MainHeader({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const languages = ['English', 'עִברִית', 'العربية'];
  const langKeys = ['en', 'he', 'ar'];

  const { locale, setLocaleValue } = useLocale();
  const { userData } = useUser();

  const [localeText, setLocaleText] = useState<string>('En');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (locale === 'en') setLocaleText('English');
    else if (locale === 'he') setLocaleText('עִברִית');
    else if (locale === 'ar') setLocaleText('العربية');
  }, [locale]);

  useEffect(() => {
    if (
      userData?.first_name == '' ||
      userData?.first_name == null ||
      userData?.field_of_interest == '' ||
      userData?.field_of_interest == null
    ) {
      setIsModalVisible(true);
    }
  }, [userData]);

  const onLocaleChange = async () => {
    const timestamp = Date.now();
    const newTimestamp = new Date(timestamp);
    newTimestamp.setSeconds(newTimestamp.getSeconds() + 10);
    const addedSeconds = newTimestamp.getTime();

    await storeStorageData(SK_RESTART_TIME, `${addedSeconds}`);
    RNRestart.restart();
  };

  const onPolicyPressed = () => {
    navigation.navigate('privacy_policy');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View
      style={[styles.container, { direction: locale === 'en' ? 'ltr' : 'rtl' }]}
    >
      <Image
        source={require('../../../../assets/images/logoWhite.png')}
        style={styles.logo}
      />

      <View style={styles.settingContainer}>
        <View style={styles.settingSelectItem}>
          {/* <Text style={styles.textItem} onPress={onLocaleChange} >{ localeText }</Text> */}
          <SelectDropdown
            data={languages}
            onSelect={(selectedItem, index) => {
              setLocaleValue(langKeys[index]);
              onLocaleChange();
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {selectedItem || ' '}
                  </Text>
                  <Image
                    source={require('../../../../assets/images/chevron-down.png')}
                    style={[
                      styles.dropdownArrow,
                      isOpened && { transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={[
                    styles.dropdownItemStyle,
                    isSelected && { backgroundColor: '#D2D9DF' },
                  ]}
                >
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
            defaultValue={localeText}
          />
        </View>
        <Pressable style={styles.settingItem} onPress={onPolicyPressed}>
          <Image
            source={require('../../../../assets/images/policy.png')}
            style={styles.imagePolicyItem}
          />
        </Pressable>
        <Pressable style={styles.settingItem} onPress={toggleModal}>
          <Image
            source={require('../../../../assets/images/setting.png')}
            style={styles.imageSettingItem}
          />
        </Pressable>
      </View>

      <PersonalSettingModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 45 : 20,
    flex: 1,
    backgroundColor: '#04939E',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  dropdownArrow: {
    marginRight: 5,
    tintColor: '#FFFFFF',
  },

  dropdownMenuStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },

  dropdownItemStyle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  dropdownItemTxtStyle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  logo: {
    width: 50,
    height: 50,
  },
  settingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
  },
  dropdownButtonStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 10,
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownButtonTxtStyle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: 'white',
  },

  settingItem: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingSelectItem: {
    width: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  imageSettingItem: {
    width: 15,
    height: 15,
  },
  imagePolicyItem: {
    width: 15,
    height: 15,
    objectFit: 'contain',
  },
});
