import {useState} from 'react';
import {StyleSheet, View, Modal, Text, Button} from 'react-native';
import {useIntl} from 'react-intl';

import {
  CustomButton,
  QuestionModal,
  useLocale,
  useQuestion,
} from '../../../components';

export default function MainFooter(): React.JSX.Element {
  const intl = useIntl();
  const {locale} = useLocale();
  const {selWall, setShowQuestionModalVisible, openQuestion} = useQuestion();

  const toggleModal = () => {
    setShowQuestionModalVisible(true);
  };

  return (
    <View style={styles.bottom}>
      <View style={styles.bottomButton}>
        {!openQuestion &&
          (selWall === 'Mathematics' || selWall === 'Physics') && (
            <CustomButton
              title={intl.formatMessage({id: `lang.${locale}.ask_question?`})}
              onPress={toggleModal}
            />
          )}
      </View>

      <QuestionModal />
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 30,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottomButton: {
    width: '80%',
  },
});
