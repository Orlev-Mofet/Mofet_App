import { StyleSheet, View } from 'react-native';
import { useIntl } from 'react-intl';

import {
  CustomButton,
  QuestionModal,
  useLocale,
  useQuestion,
} from '../../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainFooter(): React.JSX.Element {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { locale } = useLocale();
  const { selWall, setShowQuestionModalVisible, openQuestion } = useQuestion();

  const toggleModal = () => {
    setShowQuestionModalVisible(true);
  };

  return (
    <View style={{ marginBottom: insets.bottom }}>
      {!openQuestion &&
        (selWall === 'Mathematics' || selWall === 'Physics') && (
          <View style={[styles.bottom]}>
            <View style={styles.bottomButton}>
              {!openQuestion &&
                (selWall === 'Mathematics' || selWall === 'Physics') && (
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
      <QuestionModal />
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
