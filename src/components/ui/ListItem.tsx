import {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  TextPopp4Regular,
  QuestionItem,
  AnswerItem,
  useLocale,
  useQuestion,
} from '..';
import {useIntl} from 'react-intl';

interface LIInterface {
  data: any;
  updateQuestionItem: (item: any) => void;
}

export default function ListItem({
  data,
  updateQuestionItem,
}: LIInterface): React.JSX.Element {
  const intl = useIntl();
  const {locale} = useLocale();
  const {openQuestion, setOpenQuestionId} = useQuestion();

  return (
    <View>
      {!(openQuestion === data?.id) && (
        <View style={styles.container}>
          <TextPopp4Regular
            style={styles.shortQuestion}
            numberOfLines={2}
            ellipsizeMode="tail">
            <Text style={styles.Qchar}>
              {' '}
              {intl.formatMessage({id: `lang.${locale}.prefix_q`})} :{' '}
            </Text>
            {data.question}
          </TextPopp4Regular>
          <Pressable
            style={styles.button}
            onPress={() => setOpenQuestionId(data?.id)}>
            <Image
              source={require('../../../assets/images/plus.png')}
              style={styles.plusImage}
            />
          </Pressable>
        </View>
      )}
      {openQuestion === data?.id && (
        <View style={styles.Econtainer}>
          <View style={styles.EheaderContainer}>
            <TextPopp4Regular
              style={styles.EheaderText}
              numberOfLines={2}
              ellipsizeMode="tail">
              <Text style={styles.Qchar}>
                {' '}
                {intl.formatMessage({id: `lang.${locale}.prefix_q`})} :{' '}
              </Text>
              {data.question}
            </TextPopp4Regular>
            <Pressable
              style={styles.button}
              onPress={() => setOpenQuestionId(0)}>
              <Image
                source={require('../../../assets/images/minus.png')}
                style={styles.plusImage}
              />
            </Pressable>
          </View>

          <QuestionItem data={data} />

          {data?.answers?.map((item: any, index: number) => (
            <AnswerItem data={item} index={index} key={item?.id} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },

  shortQuestion: {
    width: '75%',
    color: '#00658F',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
    flexWrap: 'nowrap',
    textAlign: 'left',
  },
  Qchar: {
    fontWeight: '900',
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: '#00658F',
    borderRadius: 18,
    color: 'white',
    alignItems: 'center',
  },
  plusImage: {
    width: 30,
    height: 30,
  },

  // expand style

  Econtainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: 'rgba(0,101,143,0.1 )',
    borderWidth: 1,
  },
  EheaderContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 65,
    backgroundColor: '#00658F',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  EheaderText: {
    width: '75%',
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
    flexWrap: 'nowrap',
    textAlign: 'left',
  },
});
