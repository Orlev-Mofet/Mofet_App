import {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Platform,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {useIntl} from 'react-intl';
import Modal from 'react-native-modal';
import EmojiPicker, {EmojiType} from 'rn-emoji-keyboard';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import {
  CustomButton,
  TextMont4Normal,
  useLocale,
  useUser,
  useQuestion,
  TextPopp4Regular,
  CommonObject,
} from '..';
import {
  storeFetchFormData,
  getFetchData,
  storeFetchProgressFormData,
} from '../../utils/fetchData';
import {ST_ERROR, ST_SUCCESS, bytesToMB} from '../../utils/constants';

export default function AnswerModal(): React.JSX.Element {
  const intl = useIntl();

  const {locale, constant} = useLocale();
  const {userData} = useUser();
  const {setUpdateQuestionItem} = useQuestion();
  const {selQuestionId, setSelQuestionId} = useQuestion();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [file, setFile] = useState<DocumentPickerResponse>();
  const [fileSort, setFileSort] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [selectedEmoji, setSelectedEmoji] = useState<any>('');

  const onAnswerChange = (q: string) => setAnswer(q);

  const onSendQuestionPressed = async () => {
    if (isFetching || !selQuestionId) return;

    if (answer === '') {
      ToastAndroid.show(
        intl.formatMessage({id: `lang.${locale}.input_answer`}),
        ToastAndroid.SHORT,
      );
      return;
    }

    if (
      file &&
      bytesToMB(file?.size || 1) > Number(constant?.max_upload_size)
    ) {
      ToastAndroid.show(
        intl.formatMessage(
          {id: `lang.${locale}.upload_file_size_limit`},
          {file_size: `${constant?.max_upload_size} MB`},
        ),
        ToastAndroid.SHORT,
      );
      return;
    }

    try {
      const newAnswer = new FormData();
      newAnswer.append('user_id', userData.id || '');
      newAnswer.append('question_id', selQuestionId);
      newAnswer.append('locale', locale);
      newAnswer.append('field', userData.field_of_interest || '');
      newAnswer.append('answer', answer);
      newAnswer.append('fileType', fileType);
      newAnswer.append('fileSort', fileSort);
      if (file) {
        newAnswer.append('file', {
          type: file?.type,
          name: file?.name,
          uri:
            Platform.OS === 'ios'
              ? file?.uri.replace('file://', '')
              : file?.uri,
        });
      }

      setIsFetching(true);

      const res = await storeFetchFormData(`answer`, newAnswer);
      // const res = await storeFetchProgressFormData('answer', newAnswer, setProgress);

      setIsFetching(false);
      if (res && res.status === ST_SUCCESS) {
        await getFetchData(
          `notify/sendPushNotification?sort=answer&locale=${locale}&field_of_interest=${userData?.field_of_interest}&id=${userData?.id}&question_id=${res?.question?.id}&field=${res?.question?.field}&question_user_id=${res?.question?.user_id}`,
        );

        ToastAndroid.show(
          intl.formatMessage({id: `lang.${locale}.answer_saved_success`}),
          ToastAndroid.SHORT,
        );
        setSelQuestionId(0);

        setAnswer('');

        setFile(undefined);
        setFileSort('');
        setFileType('');
        setUpdateQuestionItem(res?.question, false);
      } else if (res.status === ST_ERROR) {
        const keys = Object.keys(res.errors);
        if (keys.length) {
          ToastAndroid.show(res.errors[keys[0]][0], ToastAndroid.SHORT);
        }
      }
    } catch (error: any) {
      setIsFetching(false);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      console.log('form data error: ', error);
    }
  };

  const handleEmojiPick = (emoji: EmojiType) => {
    setSelectedEmoji(emoji.emoji);
  };

  useEffect(() => {
    if (selectedEmoji !== '') {
      const text =
        answer.slice(0, selectionStart) +
        selectedEmoji +
        answer.slice(selectionStart);

      setAnswer(prev => text);
      setSelectionStart(prev => prev + selectedEmoji.length);
      setSelectedEmoji('');
    }
  }, [selectedEmoji]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.audio,
          DocumentPicker.types.video,
          DocumentPicker.types.images,
        ],
      });

      setFile(result);
      setFileSort(result?.type?.split('/')[0] || '');
      setFileType(
        result?.name?.split('.')[result?.name?.split('.').length - 1] || '',
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const onSelectionChange = (event: any) => {
    const {start} = event.nativeEvent.selection;
    setSelectionStart(start);
  };

  return (
    <Modal isVisible={!!selQuestionId} backdropColor="rgba(1, 90, 128, 0.9)">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Pressable onPress={() => setSelQuestionId(0)}>
              <Image
                source={require('../../../assets/images/modal_close.png')}
                style={styles.modalClose}
              />
            </Pressable>
          </View>
          <View style={styles.contentContainer}>
            <TextMont4Normal style={styles.header}>
              {intl.formatMessage({id: 'label.main.answer'})}
            </TextMont4Normal>

            <View style={styles.content}>
              <TextInput
                style={styles.developer}
                multiline={true}
                value={answer}
                onChangeText={onAnswerChange}
                onSelectionChange={onSelectionChange}
              />
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.iconContainer}>
                <Pressable
                  style={styles.roundContainer}
                  onPress={() => setIsOpen(true)}>
                  <Image
                    source={require('../../../assets/images/emoji_icon.png')}
                    style={styles.icon}
                  />
                </Pressable>
                <Pressable
                  style={[
                    styles.roundContainer,
                    file && {backgroundColor: '#1485A3'},
                  ]}
                  onPress={handleFilePick}>
                  <Image
                    source={require('../../../assets/images/pin_icon.png')}
                    style={[
                      styles.icon,
                      !file ? {tintColor: '#6A6A6A'} : {tintColor: '#FFFFFF'},
                    ]}
                  />
                </Pressable>

                {file && isFetching && progress > 0 && progress < 1 && (
                  <TextPopp4Regular style={{paddingTop: 10}}>
                    {Math.floor(progress * 100)}%
                  </TextPopp4Regular>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={intl.formatMessage({id: 'label.main.send'})}
                  onPress={onSendQuestionPressed}
                  size="small"
                  icon={'flight'}
                  isLoading={isFetching}
                />
              </View>
            </View>
            <View style={{direction: 'ltr'}}>
              <EmojiPicker
                onEmojiSelected={(emoji: EmojiType) => handleEmojiPick(emoji)}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                allowMultipleSelections={true}
              />
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
  },
  modalClose: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: -40,
    right: 3,
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
    color: '#000000',
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
});
