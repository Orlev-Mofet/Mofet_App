import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Platform,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { useIntl } from 'react-intl';
import Modal from 'react-native-modal';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import {
  pick,
  types,
  DocumentPickerResponse,
} from '@react-native-documents/picker';

import { TextPopp4Regular, useLocale, useUser } from '..';

import { CustomButton, TextMont4Normal, useQuestion } from '..';
import { getFetchData, storeFetchFormData } from '../../utils/fetchData';
import { ST_ERROR, ST_SUCCESS, bytesToMB } from '../../utils/constants';

interface IQuestionModal {
  onSuccess?: () => void;
}

export default function QuestionModal({
  onSuccess,
}: IQuestionModal): React.JSX.Element {
  const intl = useIntl();

  const { locale, constant } = useLocale();
  const { userData } = useUser();
  const {
    questions,
    setQuestionsData,
    selWall,
    showQuestionModal,
    setShowQuestionModalVisible,
  } = useQuestion();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [file, setFile] = useState<DocumentPickerResponse>();
  const [fileSort, setFileSort] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [progress, setProgress] = useState<number>();
  const [selectedEmoji, setSelectedEmoji] = useState<any>('');

  const onQuestionChange = (q: string) => setQuestion(q);

  const onSendQuestionPressed = async () => {
    if (isFetching) return;

    if (question === '') {
      ToastAndroid.show(
        intl.formatMessage({ id: `lang.${locale}.input_question` }),
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
          { id: `lang.${locale}.upload_file_size_limit` },
          { file_size: `${constant?.max_upload_size} MB` },
        ),
        ToastAndroid.SHORT,
      );
      return;
    }

    try {
      const newQeustion = new FormData();
      newQeustion.append('user_id', userData.id || '');
      newQeustion.append('locale', locale);
      newQeustion.append('field', selWall || '');
      newQeustion.append('question', question);
      newQeustion.append('fileType', fileType);
      newQeustion.append('fileSort', fileSort);
      if (file) {
        newQeustion.append('file', {
          type: file?.type,
          name: file?.name,
          uri:
            Platform.OS === 'ios'
              ? file?.uri.replace('file://', '')
              : file?.uri,
        });
      }

      setIsFetching(true);

      const res = await storeFetchFormData(`question`, newQeustion);
      // const res = await storeFetchProgressFormData('question', newQeustion, setProgress);

      setIsFetching(false);
      if (res && res.status === ST_SUCCESS) {
        setQuestionsData([res.question, ...questions]);

        const body = intl.formatMessage({
          id:
            res.question?.field.toLowerCase() === 'both'
              ? `new_both_question_posted`
              : `lang.${locale}.new_${res.question?.field.toLowerCase()}_question_posted`,
        });

        getFetchData(
          `notify/sendPushNotification?body=${body}&title=${'Question'}&id=${
            userData?.id
          }&field=${res.question?.field}&type=question`,
        );

        Alert.alert(
          '',
          intl.formatMessage({ id: `lang.${locale}.question_saved_success` }),
        );

        setQuestion('');

        setFile(undefined);
        setFileSort('');
        setFileType('');

        setShowQuestionModalVisible(!showQuestionModal);
      } else if (res && res.status === ST_ERROR) {
        const keys = Object.keys(res.errors);
        if (keys.length) {
          ToastAndroid.show(res.errors[keys[0]][0], ToastAndroid.SHORT);
        }
      }

      if (onSuccess) onSuccess();
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
        question.slice(0, selectionStart) +
        selectedEmoji +
        question.slice(selectionStart);

      setQuestion(prev => text);
      setSelectionStart(prev => prev + selectedEmoji.length);
      setSelectedEmoji('');
    }
  }, [selectedEmoji]);

  const handleFilePick = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: [types.audio, types.video, types.images],
      });

      const fileData = result[0];

      setFile(fileData);
      setFileSort(fileData?.type?.split('/')[0] || '');
      setFileType(fileData?.name?.split('.').pop() || '');
    } catch (err) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
        // user cancelled
        return;
      }
    }
  };

  const onSelectionChange = (event: any) => {
    const { start } = event.nativeEvent.selection;
    setSelectionStart(start);
  };

  const isRTL = locale === 'he' || locale === 'ar';

  return (
    <Modal isVisible={showQuestionModal} backdropColor="rgba(1, 90, 128, 0.9)">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.top}>
              <Pressable onPress={() => setShowQuestionModalVisible(false)}>
                <Image
                  source={require('../../../assets/images/modal_close.png')}
                  style={styles.modalClose}
                />
              </Pressable>
            </View>
            <View style={styles.contentContainer}>
              <TextMont4Normal style={styles.header}>
                {intl.formatMessage({ id: `lang.${locale}.ask_question` })}
              </TextMont4Normal>

              <View style={styles.content}>
                <TextInput
                  style={[
                    styles.developer,
                    {
                      textAlign: selWall !== 'Both' && isRTL ? 'right' : 'left',
                      writingDirection:
                        selWall !== 'Both' && isRTL ? 'rtl' : 'ltr',
                    },
                  ]}
                  multiline
                  value={question}
                  onChangeText={onQuestionChange}
                  onSelectionChange={onSelectionChange}
                  textAlignVertical="top"
                  returnKeyType="send"
                  blurOnSubmit={true}
                  onSubmitEditing={onSendQuestionPressed}
                />
              </View>

              <View style={styles.bottomContainer}>
                <View style={styles.iconContainer}>
                  <Pressable
                    style={styles.roundContainer}
                    onPress={() => setIsOpen(true)}
                  >
                    <Image
                      source={require('../../../assets/images/emoji_icon.png')}
                      style={styles.icon}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.roundContainer,
                      file && { backgroundColor: '#1485A3' },
                    ]}
                    onPress={handleFilePick}
                  >
                    <Image
                      source={require('../../../assets/images/pin_icon.png')}
                      style={[
                        styles.icon,
                        !file
                          ? { tintColor: '#6A6A6A' }
                          : { tintColor: '#FFFFFF' },
                      ]}
                    />
                  </Pressable>

                  {file && isFetching && progress > 0 && progress < 1 && (
                    <TextPopp4Regular style={{ paddingTop: 10 }}>
                      {Math.floor(progress * 100)}%
                    </TextPopp4Regular>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={intl.formatMessage({ id: 'label.main.send' })}
                    onPress={onSendQuestionPressed}
                    size="small"
                    icon={'flight'}
                    isLoading={isFetching}
                  />
                </View>
              </View>
              <View style={{ direction: 'ltr' }}>
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
      </KeyboardAvoidingView>
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
