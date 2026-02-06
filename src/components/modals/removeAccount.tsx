import {Image, Pressable, StyleSheet, ToastAndroid, View} from 'react-native';
import Modal from 'react-native-modal';
import {useState} from 'react';
import {useIntl} from 'react-intl';

import {
  CustomButton,
  TextMont4Normal,
  useLocale,
  useUser,
  useQuestion,
  initialAbuseType,
} from '..';
import {
  deleteFetchData,
  getFetchData,
  updateFetchData,
} from '../../utils/fetchData';
import {SK_TOKEN, ST_SUCCESS} from '../../utils/constants';
import {removeStorageData} from '../../utils/localStorage';
import {useNavigation} from '@react-navigation/native';

export default function RemoveAccountModal({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const {locale} = useLocale();

  const {removeConfirmation, setRemoveConfirmation, userData, setUserData} =
    useUser();

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const onRemovePress = async () => {
    await deleteFetchData(`user/${userData?.id}`);
    setRemoveConfirmation(false);
    removeStorageData(SK_TOKEN);
    navigation.navigate('register');
  };

  return (
    <Modal isVisible={removeConfirmation} backdropColor="rgba(1, 90, 128, 0.9)">
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable onPress={() => setRemoveConfirmation(false)}>
            <Image
              source={require('../../../assets/images/modal_close.png')}
              style={styles.modalClose}
            />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <TextMont4Normal style={styles.header}>
            {/* {intl.formatMessage({id: `lang.${locale}.confirming_abuse`})} */}
            Confirming Account Removal
          </TextMont4Normal>

          <View style={styles.content}>
            <TextMont4Normal style={{textAlign: 'center'}}>
              {/* {intl.formatMessage({
                id: `lang.${locale}.confirming_abuse_content`,
              })} */}
              This is irreversible process and you might loos all of you posted
              questions, would you like to proceed ?
            </TextMont4Normal>
          </View>

          <View style={styles.bottomContainer}>
            <View style={{flex: 1}}>
              <CustomButton
                title={intl.formatMessage({id: 'label.main.comfirm'})}
                onPress={onRemovePress}
                size="small"
                isLoading={isFetching}
              />
            </View>

            <View style={{flex: 1}}>
              <CustomButton
                title={intl.formatMessage({id: 'label.main.cancel'})}
                onPress={() => setRemoveConfirmation(false)}
                size="small"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {},
  top: {
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  modalClose: {
    width: 35,
    height: 35,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    minHeight: 300,
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
    paddingVertical: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developer: {
    height: 250,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  // page header

  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1485A3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
  buttonContainer: {
    width: 100,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  roundContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 18,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
