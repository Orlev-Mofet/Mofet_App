import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  I18nManager,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';

import { useUser, useLocale, CustomButton, TextMont4Normal } from '..';
import { updateFetchData } from '../../utils/fetchData';
import { ST_SUCCESS, FIELDS, APP_VERSION } from '../../utils/constants';
import { CustomRadioButton } from '..';

import { useIntl } from 'react-intl';

interface PSInterface {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export default function PersonalSettingModal({
  isModalVisible,
  toggleModal,
}: PSInterface): React.JSX.Element {
  const intl = useIntl();
  const { setUserData, userData, setShowContactUs, setRemoveConfirmation } =
    useUser();
  const { constant, messages, locale } = useLocale();

  const [years, setYears] = useState<number[]>([]);
  const grades = messages['grade'] || [];

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>(
    userData?.first_name || '',
  );
  const [surname, setSurname] = useState<string>(userData?.surname || '');
  const [yearOfBirth, setYearOfBirth] = useState<number>(
    userData?.year_of_birth || 0,
  );
  const [schoolName, setSchoolName] = useState<string>(
    userData?.school_name || '',
  );
  const [city, setCity] = useState<string>(userData?.city || '');
  const [gender, setGender] = useState<string>(userData?.gender || 'male');
  const [email, setEmail] = useState<string>(userData?.email || '');
  const [grade, setGrade] = useState<string>(userData?.grade || '');
  const [fieldOfInterest, setFieldOfInterest] = useState<string>(
    userData?.field_of_interest || '',
  );
  const [approvedNoti, setApprovedNoti] = useState<number>(
    userData?.approve_notification || 1,
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    let arrYears = [];
    for (let index = currentYear; index > 1989; index--) {
      arrYears.push(index);
    }
    setYears(arrYears);
  }, []);

  const onSwitch = () => {
    console.log(+!approvedNoti);

    setApprovedNoti(+!approvedNoti);
  };

  const onSaveSettingPressed = async () => {
    if (firstName == '' || fieldOfInterest == '' || email == '') {
      ToastAndroid.show(
        intl.formatMessage({
          id: `lang.${locale}.must_input_personal_setting`,
        }),
        ToastAndroid.SHORT,
      );
      return;
    }

    const data = {
      first_name: firstName,
      surname: surname,
      year_of_birth: yearOfBirth,
      school_name: schoolName,
      city: city,
      gender: gender,
      email: email,
      grade: grade,
      field_of_interest: fieldOfInterest,
      approve_notification: approvedNoti,
    };

    console.log(data);

    try {
      setIsFetching(true);

      const res = await updateFetchData(`user/${userData.id}`, data);
      setIsFetching(false);
      if (res && res.status == ST_SUCCESS) {
        setUserData(res.user);

        ToastAndroid.show(
          intl.formatMessage({
            id: `lang.${locale}.personal_setting_saved_success`,
          }),
          ToastAndroid.SHORT,
        );
        setTimeout(function () {
          toggleModal();
        }, 1500);
      }
    } catch (error: any) {
      console.log(error);

      console.log(error.message);
      setIsFetching(false);
    }
  };

  const handleShowContactUs = () => {
    toggleModal();
    setTimeout(() => {
      setShowContactUs(true);
    }, 1000);
  };
  const handleRemoveAccountConfirmation = () => {
    toggleModal();
    setTimeout(() => {
      setRemoveConfirmation(true);
    }, 1000);
  };

  return (
    <Modal isVisible={isModalVisible} backdropColor="rgba(1, 90, 128, 0.9)">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Pressable onPress={toggleModal}>
              <Image
                source={require('../../../assets/images/modal_close.png')}
                style={styles.modalClose}
              />
            </Pressable>
          </View>
          <View style={styles.contentContainer}>
            <TextMont4Normal style={styles.header}>
              {intl.formatMessage({ id: 'label.setting.personal_setting' })}
            </TextMont4Normal>
            <View style={styles.content}>
              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.first_name` })}
                </TextMont4Normal>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setFirstName}
                  value={firstName}
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.surname` })}
                </TextMont4Normal>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setSurname}
                  value={surname}
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.year_of_birth` })}
                </TextMont4Normal>
                <SelectDropdown
                  data={years}
                  onSelect={(selectedItem: number) => {
                    setYearOfBirth(selectedItem);
                  }}
                  defaultValue={yearOfBirth}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedItem || ' '}
                        </Text>
                        <Image
                          source={require('../../../assets/images/chevron-down.png')}
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
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.school_name` })}
                </TextMont4Normal>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setSchoolName}
                  value={schoolName}
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.city` })}
                </TextMont4Normal>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setCity}
                  value={city}
                />
              </View>

              <View style={styles.genderRow}>
                <CustomRadioButton
                  selected={gender === 'male'}
                  onPress={setGender}
                  label={intl.formatMessage({ id: `lang.${locale}.male` })}
                  keyValue={'male'}
                />
                <CustomRadioButton
                  selected={gender === 'female'}
                  onPress={setGender}
                  label={intl.formatMessage({ id: `lang.${locale}.female` })}
                  keyValue={'female'}
                />
                <CustomRadioButton
                  selected={gender === 'others'}
                  onPress={setGender}
                  label={intl.formatMessage({ id: `lang.${locale}.others` })}
                  keyValue={'others'}
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.email` })}
                </TextMont4Normal>
                <TextInput
                  style={styles.textInputNormal}
                  onChangeText={setEmail}
                  value={email}
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.labelText}>
                  {intl.formatMessage({ id: `lang.${locale}.your_grade` })}
                </TextMont4Normal>
                <SelectDropdown
                  data={grades}
                  onSelect={(selectedItem, index) => {
                    setGrade(selectedItem);
                  }}
                  defaultValue={grade}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedItem || ' '}
                        </Text>
                        <Image
                          source={require('../../../assets/images/chevron-down.png')}
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
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={[styles.labelText]}>
                  {intl.formatMessage({
                    id: `lang.${locale}.field_of_interest`,
                  })}
                </TextMont4Normal>
                <SelectDropdown
                  data={FIELDS}
                  onSelect={(selectedItem, index) => {
                    setFieldOfInterest(selectedItem);
                  }}
                  defaultValue={fieldOfInterest}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedItem || ' '}
                        </Text>
                        <Image
                          source={require('../../../assets/images/chevron-down.png')}
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
                />
              </View>

              <View style={styles.row}>
                <TextMont4Normal style={styles.switchLabel}>
                  {intl.formatMessage({
                    id: `lang.${locale}.approved_notification`,
                  })}
                </TextMont4Normal>
                <Switch
                  onValueChange={onSwitch}
                  value={!!approvedNoti}
                  style={styles.switch}
                />
              </View>
              <View style={styles.saveButtonContainer}>
                <CustomButton
                  style={{ backgroundColor: 'red' }}
                  // title={intl.formatMessage({
                  //   id: 'label.setting.save_settings',
                  // })}
                  title="Remove Account"
                  onPress={handleRemoveAccountConfirmation}
                  size="small"
                  isLoading={isFetching}
                />
              </View>

              <View style={styles.saveButtonContainer}>
                <CustomButton
                  title={intl.formatMessage({
                    id: 'label.setting.save_settings',
                  })}
                  onPress={onSaveSettingPressed}
                  size="small"
                  isLoading={isFetching}
                />
              </View>
            </View>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.bottomText} onPress={handleShowContactUs}>
              {intl.formatMessage(
                { id: 'label.setting.contact_us_by_email' },
                { mail: constant?.contact_mail },
              )}
            </Text>
            <Text style={styles.bottomText}>
              {intl.formatMessage(
                { id: 'auth.label.version' },
                { version: APP_VERSION },
              )}
            </Text>
            <Text style={styles.bottomText}>
              {intl.formatMessage(
                { id: 'label.setting.developed_by' },
                { name: 'Orlev Levy-Nissenbaum' },
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 35,
  },
  top: {
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  modalClose: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },

  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
  },
  dropdownButtonStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 10,
    width: '60%',
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownButtonTxtStyle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },

  dropdownArrow: {},

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
  header: {
    backgroundColor: '#F4F4F4',
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 15,
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelText: {
    color: 'rgba(1, 90, 128, 0.9)',
    fontSize: 12,
    textTransform: 'uppercase',
    width: '38%',
    textAlign: 'left',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 10,
    width: '60%',
    textAlign: 'center',
    color: '#000',
    fontSize: 12,
    textTransform: 'capitalize',
    fontFamily: 'Montserrat-Medium',
    height: 40,
    padding: 0,
  },
  textInputNormal: {
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 10,
    width: '60%',
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    height: 40,
    padding: 0,
  },
  genderRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  switchLabel: {
    color: 'rgba(1, 90, 128, 0.9)',
    fontSize: 12,
    textTransform: 'uppercase',
    width: '80%',
    textAlign: 'left',
  },
  switch: {
    transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }],
  },
  saveButtonContainer: {
    width: 115,
    justifyContent: 'center',
  },
  bottom: {
    marginVertical: 10,
  },
  bottomText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
