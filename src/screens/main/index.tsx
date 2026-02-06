import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ToastAndroid,
  Text,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {useIntl} from 'react-intl';
import messaging from '@react-native-firebase/messaging';

import MainHeader from './layout/header';
import SelectWall from './layout/selectWall';
import MainFooter from './layout/footer';
import {
  ListItem,
  TextMont4Normal,
  useLocale,
  useUser,
  useQuestion,
  CustomSearchBox,
  AbuseModal,
  AnswerModal,
  ContactUsModal,
  CommonObject,
} from '../../components';

import {getFetchData} from '../../utils/fetchData';
import {
  ST_SUCCESS,
  MP_SEARCH_TEXT,
  MP_SELECTED_WALL,
} from '../../utils/constants';
import {storeStorageData, getStorageData} from '../../utils/localStorage';
import Toast from 'react-native-toast-message';
import RemoveAccountModal from '../../components/modals/removeAccount';

export default function MainPage({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const intl = useIntl();
  const {locale} = useLocale();
  const {
    questions,
    selWall,
    isFetching,
    setQuestionsData,
    setSelWallText,
    setIsFetchingFlag,
  } = useQuestion();
  const {userData} = useUser();
  const flatListRef = useRef<FlatList<any>>(null);
  const wallRef = useRef<any>({
    selWall: selWall,
    questions: questions,
    locale: locale,
  });

  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [nextPageUrl, setNextPageUrl] = useState<string | null>('start');

  const setInitValue = () => {
    setNextPageUrl('start');
    setPage(1);
    if (flatListRef && flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  const onSearchClear = () => {
    setSearchText('');
    setInitValue();
    getQuestions(
      userData.id,
      userData.field_of_interest,
      locale,
      selWall,
      '',
      1,
      '1',
      true,
    );
  };

  const onSearch = (value: string) => {
    setSearchText(value);
    setInitValue();
    getQuestions(
      userData.id,
      userData.field_of_interest,
      locale,
      selWall,
      value,
      1,
      '1',
      true,
    );
  };

  const onWallChanged = useCallback(
    (value: string) => {
      if (isFetching || value === selWall) return;

      setSelWallText(value);
      storeStorageData(MP_SELECTED_WALL, value);
      setInitValue();
      getQuestions(
        userData.id,
        userData.field_of_interest,
        locale,
        value,
        searchText,
        1,
        '1',
        true,
      );
    },
    [questions, selWall, isFetching],
  );

  const updateQuestionItem = (question: any) => {};

  const ItemSeparator = () => (
    <View style={{height: 10, backgroundColor: 'transparent'}} />
  );
  const renderItem = ({item}: {item: any}) => (
    <ListItem
      data={item}
      key={item.id}
      updateQuestionItem={updateQuestionItem}
    />
  );

  const getQuestions = useCallback(
    (
      user_id: string,
      field: string,
      locale: string,
      wall: string,
      search: string,
      pageNum: number,
      nextPage: string | null,
      init: boolean = false,
    ) => {
      const run = async (
        user_id: string,
        field: string,
        locale: string,
        wall: string,
        search: string,
        pageNum: number,
        nextPage: string | null,
        init: boolean,
      ) => {
        if (!nextPage) return;
        setIsFetchingFlag(true);

        try {
          const res = await getFetchData(
            `question?user_id=${user_id}&field=${field}&locale=${locale}&wall=${wall}&search=${search}&page=${pageNum}`,
          );
          if (res && res.status === ST_SUCCESS) {
            setPage(res.data.current_page + 1);
            setNextPageUrl(res.data.next_page_url);
            if (init) {
              setQuestionsData(res.data.data);
            } else {
              setQuestionsData([...questions, ...res.data.data]);
            }
          }
          setIsFetchingFlag(false);
        } catch (error: any) {
          setIsFetchingFlag(false);
          if (error.message === 401) {
            navigation.navigate('verify');
          }
        }
      };
      run(user_id, field, locale, wall, search, pageNum, nextPage, init);
    },
    [questions],
  );

  const getQuestion = useCallback(
    (
      question_id: number,
      question_type: string,
      wall: string = selWall,
      allQuestion: CommonObject[] = [],
    ) => {
      if (question_id === 0) return;

      const run = async (question_id: number, allQuestion: CommonObject[]) => {
        setIsFetchingFlag(true);
        try {
          const res = await getFetchData(
            `question/question_by_id?question_id=${question_id}`,
          );
          if (res && res.status === ST_SUCCESS) {
            setQuestionsData([res.question, ...allQuestion]);
          }
          setIsFetchingFlag(false);
        } catch (error: any) {
          setIsFetchingFlag(false);
        }
      };

      if (wall === question_type || wall === 'Both' || wall === 'AllQuestion') {
        run(question_id, allQuestion);
      }
    },
    [questions, selWall],
  );

  const getAnsweredQuestion = useCallback(
    (question_id: number, allQuestion: CommonObject[] = []) => {
      if (question_id === 0) return;

      const run = async (question_id: number, allQuestion: CommonObject[]) => {
        setIsFetchingFlag(true);
        try {
          const res = await getFetchData(
            `question/question_by_id?question_id=${question_id}`,
          );
          if (res && res.status === ST_SUCCESS) {
            const index = allQuestion.findIndex(
              (item: CommonObject) => item.id === res?.question?.id,
            );
            const newQuestions = [...allQuestion];

            if (index > -1) {
              newQuestions.splice(index, 1, res?.question);
              setQuestionsData(newQuestions);
            }
          }
          setIsFetchingFlag(false);
        } catch (error: any) {
          setIsFetchingFlag(false);
        }
      };

      run(question_id, allQuestion);
    },
    [questions, selWall],
  );

  const loadMoreData = () => {
    getQuestions(
      userData.id,
      userData.field_of_interest,
      locale,
      selWall,
      searchText,
      page,
      nextPageUrl,
    );
  };

  useEffect(() => {
    const init = async () => {
      const savedWall = await getStorageData(MP_SELECTED_WALL);
      const savedSearchText = await getStorageData(MP_SEARCH_TEXT);

      setSelWallText(savedWall || 'Mathematics');
      setSearchText(savedSearchText || '');

      getQuestions(
        userData.id,
        userData.field_of_interest,
        locale,
        savedWall || 'Mathematics',
        savedSearchText || '',
        page,
        '1',
      );
    };

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!!!userData.approve_notification) return;

      const wallValue = wallRef?.current;

      const data = JSON.parse(remoteMessage?.notification?.body || '');
      if (remoteMessage?.notification?.title === 'question_Physics') {
        if (wallValue?.locale === data?.locale) {
          //   ToastAndroid.show(
          //     intl.formatMessage({
          //       id: `lang.${locale}.new_physics_question_posted`,
          //     }),
          //     ToastAndroid.SHORT,
          //   );
          Toast.show({
            text1: intl.formatMessage({
              id: `lang.${locale}.new_physics_question_posted`,
            }),
          });
          getQuestion(
            (data?.question_id as unknown as number) || 0,
            'Physics',
            wallValue?.selWall,
            wallValue?.questions,
          );
        }
      } else if (
        remoteMessage?.notification?.title === 'question_Mathematics'
      ) {
        if (wallValue?.locale === data?.locale) {
          //   ToastAndroid.show(
          //     intl.formatMessage({
          //       id: `lang.${locale}.new_mathematics_question_posted`,
          //     }),
          //     ToastAndroid.SHORT,
          //   );
          Toast.show({
            text1: intl.formatMessage({
              id: `lang.${locale}.new_mathematics_question_posted`,
            }),
          });

          getQuestion(
            (data?.question_id as unknown as number) || 0,
            'Mathematics',
            wallValue?.selWall,
            wallValue?.questions,
          );
        }
      } else if (remoteMessage?.notification?.title === 'answer') {
        if (wallValue?.locale === data?.locale) {
          if (data?.question_user_id === userData?.id) {
            // ToastAndroid.show(
            //   intl.formatMessage({
            //     id: `lang.${locale}.answer_added_on_your_question`,
            //   }),
            //   ToastAndroid.SHORT,
            // );
            Toast.show({
              text1: intl.formatMessage({
                id: `lang.${locale}.answer_added_on_your_question`,
              }),
            });
          } else if (data?.field === 'Mathematics') {
            // ToastAndroid.show(
            //   intl.formatMessage({
            //     id: `lang.${locale}.answer_posted_on_math_question`,
            //   }),
            //   ToastAndroid.SHORT,
            // );
            Toast.show({
              text1: intl.formatMessage({
                id: `lang.${locale}.answer_posted_on_math_question`,
              }),
            });
          } else if (data?.field === 'Physics') {
            // ToastAndroid.show(
            //   intl.formatMessage({
            //     id: `lang.${locale}.answer_posted_on_physics_question`,
            //   }),
            //   ToastAndroid.SHORT,
            // );
            Toast.show({
              text1: intl.formatMessage({
                id: `lang.${locale}.answer_posted_on_physics_question`,
              }),
            });
          }
          getAnsweredQuestion(
            (data?.question_id as unknown as number) || 0,
            wallValue?.questions,
          );
        }
      } else if (remoteMessage?.notification?.title === 'abuse_question') {
        // ToastAndroid.show(
        //   intl.formatMessage({id: `lang.${locale}.your_question_abused`}),
        //   ToastAndroid.SHORT,
        // );
        Toast.show({
          text1: intl.formatMessage({
            id: `lang.${locale}.your_question_abused`,
          }),
        });
      } else if (remoteMessage?.notification?.title === 'abuse_answer') {
        Toast.show({
          text1: intl.formatMessage({id: `lang.${locale}.your_answer_abused`}),
        });
        // ToastAndroid.show(
        //   intl.formatMessage({id: `lang.${locale}.your_answer_abused`}),
        //   ToastAndroid.SHORT,
        // );
      } else if (remoteMessage?.notification?.title == 'admin_alarm') {
        Toast.show({
          text1: `Administrator Alarm:`,
          text2: `${remoteMessage?.notification?.body}`,
        });
        // ToastAndroid.show(
        //   'Administrator Alarm: \n ' + remoteMessage?.notification?.body,
        //   ToastAndroid.LONG,
        // );
      }
    });

    init();
    unsubscribe;
  }, []);

  useEffect(() => {
    wallRef.current = {selWall: selWall, questions: questions, locale: locale};
  }, [questions, selWall]);

  return (
    <View
      style={[styles.container, {direction: locale === 'en' ? 'ltr' : 'rtl'}]}>
      <View style={styles.headerContainer}>
        <MainHeader navigation={navigation} />
      </View>
      <View>
        <SelectWall
          selectedWall={selWall}
          setSelectedWall={setSelWallText}
          onWallChanged={onWallChanged}
        />
      </View>

      <View style={styles.content}>
        <View>
          <TextMont4Normal style={[styles.topText]}>
            {intl.formatMessage({id: `lang.${locale}.questions_answers`})}
          </TextMont4Normal>
          <CustomSearchBox
            value={searchText}
            onSearch={onSearch}
            onClear={onSearchClear}
          />
        </View>
        <View style={styles.questionContainer}>
          <FlatList
            data={questions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ref={flatListRef}
            ListEmptyComponent={
              <View>
                <Text style={{textAlign: 'center', marginTop: 10}}>
                  There are no search results
                </Text>
              </View>
            }
          />
        </View>
      </View>

      <View>
        <MainFooter />
      </View>
      <AbuseModal />
      <AnswerModal />
      <ContactUsModal />
      <RemoveAccountModal navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: Platform.OS === 'ios' ? 115 : 80,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
  questionContainer: {
    flex: 1,
    gap: 10,
  },

  topText: {
    color: '#00658f',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
