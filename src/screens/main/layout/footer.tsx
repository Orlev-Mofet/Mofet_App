import { StyleSheet, View } from 'react-native';
import { useIntl } from 'react-intl';

import {
  CustomButton,
  QuestionModal,
  useLocale,
  useQuestion,
} from '../../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IMainFooter {
  onSuccess?: () => void;
}

export default function MainFooter({
  onSuccess,
}: IMainFooter): React.JSX.Element {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { locale } = useLocale();
  const { selWall, setShowQuestionModalVisible, openQuestion } = useQuestion();

  const toggleModal = () => {
    setShowQuestionModalVisible(true);
  };

  const isShowQuestionButton =
    selWall === 'Mathematics' || selWall === 'Physics' || selWall === 'Both';

  return (
    <View style={{ marginBottom: insets.bottom }}>
      {!openQuestion && isShowQuestionButton && (
        <View style={[styles.bottom]}>
          <View style={styles.bottomButton}>
            {!openQuestion && isShowQuestionButton && (
              <CustomButton
                title={intl.formatMessage({
                  id: `lang.${locale}.ask_question?`,
                })}
                onPress={toggleModal}
              />
            )}
          </View>
        </View>
      )}
      <QuestionModal onSuccess={onSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 10,
    marginBottom: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottomButton: {
    width: '90%',
  },
});
