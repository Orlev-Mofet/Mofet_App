import {useMemo, useState} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useIntl} from 'react-intl';
import Modal from 'react-native-modal';

import {CustomButton, TextMont4Normal, useUser, useLocale} from '..';
import {storeFetchData} from '../../utils/fetchData';
import {ST_SUCCESS} from '../../utils/constants';

interface CUInterface {}

export default function ContactUsModal({}: CUInterface): React.JSX.Element {
  const {userData, setShowContactUs, contactUs} = useUser();
  const {locale, constant} = useLocale();
  const intl = useIntl();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  const onContentChange = (q: string) => setContent(q);

  const onContactUs = async () => {
    if (userData?.email === '') {
      ToastAndroid.show(
        intl.formatMessage({id: `lang.${locale}.complete_personal_setting`}),
        ToastAndroid.SHORT,
      );
      return;
    }

    if (content === '') {
      ToastAndroid.show(
        intl.formatMessage({id: `lang.${locale}.input_content`}),
        ToastAndroid.SHORT,
      );
      return;
    }

    const data = {
      email: userData?.email,
      user_id: userData?.id,
      content: content,
    };

    try {
      setIsFetching(true);
      const res = await storeFetchData('contact_us', data);
      setIsFetching(false);

      if (res && res.status == ST_SUCCESS) {
        ToastAndroid.show(
          intl.formatMessage({id: `lang.${locale}.contact_us_success`}),
          ToastAndroid.SHORT,
        );
        setContent('');

        setTimeout(function () {
          setShowContactUs(false);
        }, 1000);
      }
    } catch (error: any) {
      setIsFetching(false);
    }
  };

  return (
    <Modal isVisible={contactUs} backdropColor="rgba(1, 90, 128, 0.9)">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Pressable onPress={() => setShowContactUs(!contactUs)}>
              <Image
                source={require('../../../assets/images/modal_close.png')}
                style={styles.modalClose}
              />
            </Pressable>
          </View>
          <View style={styles.contentContainer}>
            <TextMont4Normal style={styles.header}>
              {intl.formatMessage({id: `lang.${locale}.contact_us`})}
            </TextMont4Normal>

            <View style={styles.content}>
              <TextMont4Normal>to: {constant.contact_mail}</TextMont4Normal>
              <TextInput
                style={styles.developer}
                multiline={true}
                value={content}
                onChangeText={onContentChange}
              />
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.iconContainer}></View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={intl.formatMessage({id: 'label.main.send'})}
                  onPress={onContactUs}
                  size="small"
                  icon={'flight'}
                  isLoading={isFetching}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  modalClose: {
    position: 'absolute',
    right: 5,
    top: -35,
    width: 35,
    height: 35,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
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

  mail: {
    fontSize: 10,
  },
});
