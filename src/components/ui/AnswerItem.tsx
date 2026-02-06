import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  ImageURISource,
  ToastAndroid,
} from 'react-native';
import {useEffect, useState} from 'react';
import Video from 'react-native-video';
import AwesomeLoading from 'react-native-awesome-loading';
import {useIntl} from 'react-intl';
import VideoPlayer from 'react-native-video-controls';

import {TextPopp4Regular, TextPopp5Medium} from '..';
import {BACKEND_STORAGE_URL} from '../../utils/constants';
import {
  CustomMusciPlayer,
  CustomDivider,
  useUser,
  useQuestion,
  useLocale,
} from '..';
import {
  storeFetchData,
  updateFetchData,
  deleteFetchData,
} from '../../utils/fetchData';

interface AIInterface {
  data: any;
  index?: number;
}

export default function AnswerItem({
  data,
  index = 0,
}: AIInterface): React.JSX.Element {
  const intl = useIntl();

  const {userData} = useUser();
  const {locale} = useLocale();

  const {setSelAbuseData, setUpdateQuestionItem, showQuestionModal} =
    useQuestion();

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
    const questionId = data?.question_id;

    let isDel = 0;
    if (type === (voteLike?.type || voteUnlike?.type)) {
      isDel = 1;
    }

    const reqData = {
      user_id: userData?.id,
      question_id: questionId,
      answer_id: data?.id,
      sort: 'answer',
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

  return (
    <View style={styles.EquestionContainer}>
      {index > 0 && (
        <CustomDivider orientation="horizontal" color="#d1e8ee" width={2} />
      )}

      <TextPopp4Regular style={styles.answerText}>
        {data.answer}
      </TextPopp4Regular>

      <TextPopp4Regular style={styles.EinfoText}>
        {intl.formatMessage(
          {id: 'label.main.posted_by'},
          {
            value: `${data?.user?.first_name || ''} (${
              data?.user?.school_name || ''
            } ${data?.user?.city || ''})`,
          },
        )}
      </TextPopp4Regular>

      {(data.file_sort === 'video' || data.file_sort === 'image') && (
        <View style={styles.EquestionMedia}>
          {data.file_sort === 'image' && (
            <Image
              source={{
                uri: `${BACKEND_STORAGE_URL}${data?.file_path?.replace(
                  'answer/',
                  'answer_sm/',
                )}`,
              }}
              style={[styles.Eimage, {display: loading ? 'none' : 'flex'}]}
              onLoadStart={() => setLoadng(true)}
              onLoadEnd={() => setLoadng(false)}
            />
          )}
          {data.file_sort === 'video' && (
            // <Video
            //   source={{uri: `${BACKEND_STORAGE_URL}${data.file_path}`}}
            //   style={styles.Evideo}
            //   muted={true}
            //   volume={1.0}
            //   onLoadStart={() => setLoadng(true)}
            //   onEnd={() => setLoadng(false)}
            //   onTouchEnd={handleTouchEnd}
            //   paused={!showControls}
            // />
            <VideoPlayer
              source={{uri: `${BACKEND_STORAGE_URL}${data.file_path}`}}
              paused={true}
              showOnStart={true}
              disableBack
              disableFullscreen
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
              }}
              onPress={handleTouchEnd}>
              <Image
                source={require('../../../assets/images/video-play.png')}
                style={{width: 50, height: 50}}
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
      <View style={styles.EbottomRow}>
        <View style={styles.Evote}>
          <View style={styles.EvoteItem}>
            <Pressable onPress={() => setVotePressed('like')}>
              {voteLike ? (
                <Image
                  source={require('../../../assets/icons/Icons/like_hover.png')}
                  style={{width: 14, height: 14}}
                />
              ) : (
                <Image
                  source={require('../../../assets/icons/Icons/like.png')}
                  style={{width: 14, height: 14}}
                />
              )}
            </Pressable>
            <TextPopp5Medium style={styles.EvoteText}>
              {data?.likes?.length}
            </TextPopp5Medium>
          </View>
          <View style={styles.EvoteItem}>
            <Pressable onPress={() => setVotePressed('unlike')}>
              {voteUnlike ? (
                <Image
                  source={require('../../../assets/icons/Icons/unlike_hover.png')}
                  style={{width: 14, height: 14}}
                />
              ) : (
                <Image
                  source={require('../../../assets/icons/Icons/unlike.png')}
                  style={{width: 14, height: 14}}
                />
              )}
            </Pressable>
            <TextPopp5Medium style={styles.EvoteText}>
              {data?.unlikes?.length}
            </TextPopp5Medium>
          </View>
        </View>
        <Pressable
          onPress={() => setSelAbuseData({id: data?.id, sort: 'answer'})}>
          <Image
            source={require('../../../assets/icons/Icons/abuse.png')}
            style={{width: 32, height: 32}}
          />
        </Pressable>
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
  answerText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#000000',
    marginTop: 10,
    textAlign: 'left',
  },
  EquestionMedia: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 185,
    position: 'relative',
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
});
