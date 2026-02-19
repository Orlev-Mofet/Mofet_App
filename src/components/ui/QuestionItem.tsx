import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  ImageURISource,
  I18nManager,
  ToastAndroid,
} from 'react-native';
import { useEffect, useState } from 'react';
import Video from 'react-native-video';
import AwesomeLoading from 'react-native-awesome-loading';
import { useIntl } from 'react-intl';
import VideoPlayer from 'react-native-video-controls';

import {
  CustomButton,
  TextPopp4Regular,
  TextPopp5Medium,
  CustomMusciPlayer,
  useUser,
  useQuestion,
  useLocale,
} from '..';
import { BACKEND_STORAGE_URL } from '../../utils/constants';
import {
  storeFetchData,
  updateFetchData,
  deleteFetchData,
} from '../../utils/fetchData';

interface QIInterface {
  data: any;
}

export default function QuestionItem({ data }: QIInterface): React.JSX.Element {
  const intl = useIntl();
  const { locale } = useLocale();

  const { userData } = useUser();
  const {
    setSelQuestionId,
    setSelAbuseData,
    setUpdateQuestionItem,
    showQuestionModal,
  } = useQuestion();

  const [loading, setLoadng] = useState<boolean>(false);
  const [voteLike, setVoteLike] = useState<any>(null);
  const [voteUnlike, setVoteUnlike] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  const setVotePressed = async (type: string) => {
    if (isFetching) return;

    if (data?.user?.id === userData?.id) {
      ToastAndroid.show(
        intl.formatMessage({
          id: `lang.${locale}.cannot_vote_on_your_question_and_answer`,
        }),
        ToastAndroid.SHORT,
      );
      return;
    }

    const voteId = voteLike?.id || voteUnlike?.id || 0;
    const questionId = data?.id;

    let isDel = 0;
    if (type === (voteLike?.type || voteUnlike?.type)) {
      isDel = 1;
    }

    const reqData = {
      user_id: userData?.id,
      question_id: questionId,
      answer_id: 0,
      sort: 'question',
      type: type,
      vote_id: voteId,
    };

    setIsFetching(true);
    try {
      let result;
      if (isDel === 1) {
        result = await deleteFetchData(`vote/${voteId}`);
      } else if (voteId === 0) {
        result = await storeFetchData(`vote`, reqData);
      } else {
        result = await updateFetchData(`vote/${voteId}`, reqData);
      }

      if (result && result.status === 'success') {
        setUpdateQuestionItem(result.question, false);
      }

      setIsFetching(false);
    } catch (error) {
      console.log('vote result => ', error);
      setIsFetching(false);
    }
  };

  const handleTouchEnd = () => {
    setShowControls(!showControls);
  };

  useEffect(() => {
    const like = data?.likes?.find((like: any) => like.user_id === userData.id);
    setVoteLike(like);
    const unlike = data?.unlikes?.find(
      (unlike: any) => unlike.user_id === userData.id,
    );
    setVoteUnlike(unlike);
  }, [data]);

  useEffect(() => {
    setShowControls(!showQuestionModal);
  }, [showQuestionModal]);

  console.log(data, 'FDDD');

  return (
    <View>
      <View style={styles.EquestionContainer}>
        <TextPopp4Regular style={styles.questionText}>
          {data.question}
        </TextPopp4Regular>

        {(data.file_sort === 'video' || data.file_sort === 'image') && (
          <View style={styles.EquestionMedia}>
            {data.file_sort === 'image' && (
              <Image
                source={{
                  uri: `${BACKEND_STORAGE_URL}${data?.file_path?.replace(
                    'question/',
                    'question_sm/',
                  )}`,
                }}
                style={[styles.Eimage]}
                // onLoadStart={() => setLoadng(true)}
                // onLoadEnd={() => setLoadng(false)}
              />
            )}
            {data.file_sort === 'video' && (
              // <Video
              // source={{uri: `${BACKEND_STORAGE_URL}${data.file_path}`}}
              //   style={styles.Evideo}
              //   controls={true}
              //   muted={false}
              //   volume={0.04}
              //   onLoadStart={() => setLoadng(true)}
              //   onEnd={() => setLoadng(false)}
              //   onTouchEnd={handleTouchEnd}
              // />
              <VideoPlayer
                source={{ uri: `${BACKEND_STORAGE_URL}${data.file_path}` }}
                onTouchEnd={handleTouchEnd}
                paused={true}
                showOnStart={true}
                disableFullscreen
                disableBack
                disableSeekbar
                ignoreSilentSwitch={'ignore'}
              />
            )}
            {data.file_sort === 'video' && (
              <Pressable
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  display: showControls ? 'none' : 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
                onPress={handleTouchEnd}
              >
                <Image
                  source={require('../../../assets/images/video-play.png')}
                  style={{ width: 50, height: 50 }}
                />
              </Pressable>
            )}
            {loading && <AwesomeLoading indicatorId={2} isActive={false} />}
          </View>
        )}
        {data.file_sort === 'audio' && (
          <CustomMusciPlayer
            uri={`${BACKEND_STORAGE_URL}${data.file_path}`}
            id={data.id}
          />
        )}

        <TextPopp4Regular style={styles.EinfoText}>
          {intl.formatMessage(
            { id: 'label.main.posted_by' },
            {
              value: `${data?.user?.first_name || ''} (${
                data?.user?.school_name || ''
              } ${data?.user?.city || ''})`,
            },
          )}
        </TextPopp4Regular>

        <View style={styles.EbottomRow}>
          <View style={styles.Evote}>
            <View style={styles.EvoteItem}>
              <Pressable onPress={() => setVotePressed('like')}>
                {voteLike ? (
                  <Image
                    source={require('../../../assets/icons/Icons/like_hover.png')}
                    style={{ width: 14, height: 14 }}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icons/Icons/like.png')}
                    style={{ width: 14, height: 14 }}
                  />
                )}
              </Pressable>
              <TextPopp5Medium style={styles.EvoteText}>
                {data?.likes_count}
              </TextPopp5Medium>
            </View>
            <View style={styles.EvoteItem}>
              <Pressable onPress={() => setVotePressed('unlike')}>
                {voteUnlike ? (
                  <Image
                    source={require('../../../assets/icons/Icons/unlike_hover.png')}
                    style={{ width: 14, height: 14 }}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icons/Icons/unlike.png')}
                    style={{ width: 14, height: 14 }}
                  />
                )}
              </Pressable>
              <TextPopp5Medium style={styles.EvoteText}>
                {data?.unlikes_count}
              </TextPopp5Medium>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
        <View style={{ flex: 1 }}>
          <CustomButton
            title={intl.formatMessage({ id: 'label.main.answer' })}
            onPress={() => setSelQuestionId(data?.id)}
            size="small"
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomButton
            title={intl.formatMessage({ id: 'label.main.abuse' })}
            onPress={() => setSelAbuseData({ id: data?.id, sort: 'question' })}
            size="small"
            icon="abuse"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EquestionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  EinfoText: {
    fontSize: 12,
    textAlign: 'left',
    color: '#015A80',
  },
  questionText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'left',
  },
  EquestionMedia: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 185,
  },
  Eimage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  Evideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  EbottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  Evote: {
    flexDirection: 'row',
    gap: 2,
  },
  EvoteItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  EvoteText: {
    fontSize: 14,
    color: '#000000',
    minWidth: 25,
    textAlign: 'left',
  },

  bottomButtonContainer: {
    backgroundColor: 'rgba(20, 133, 163, 0.2)',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
});
