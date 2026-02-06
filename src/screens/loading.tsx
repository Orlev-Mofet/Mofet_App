import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import AwesomeLoading from 'react-native-awesome-loading';

import {getStorageData} from '../utils/localStorage';
import {SK_RESTART_TIME, SK_USER_DATA} from '../utils/constants';
import {useUser, useLocale} from '../components';
import {getFetchData} from '../utils/fetchData';

export default function LoadingScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const {setUserData} = useUser();
  const {addMessages, setConstantData} = useLocale();

  useEffect(() => {
    const checkTimestamp = async () => {
      const savedTimeStamp = await getStorageData(SK_RESTART_TIME);
      const timestamp = Date.now();

      if (timestamp < parseInt(savedTimeStamp || '')) {
        const userData = await getStorageData(SK_USER_DATA);
        if (userData) {
          setUserData(JSON.parse(userData));
        }

        const result = await getFetchData(`language`);
        if (result && result.status === 'success') {
          let newLang = {};
          for (const iterator of result.languages) {
            newLang = {...newLang, ...iterator};
          }
          addMessages(newLang);

          let constants = {};
          for (const iterator of result.constants) {
            constants = {...constants, ...iterator};
          }

          setConstantData(constants);
        }

        navigation.navigate('main');
      } else {
        navigation.navigate('splash');
      }
    };

    checkTimestamp();
  }, []);

  return (
    <View style={styles.contianer}>
      <AwesomeLoading
        indicatorId={1}
        size={50}
        isActive={true}
        text="loading..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
