import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
  TextMont4Normal,
  TextPopp4Regular,
  useLocale,
} from '../../../components';
import { useIntl } from 'react-intl';
import { FlatList, Pressable } from 'react-native-gesture-handler';

interface SWInterface {
  selectedWall: string;
  setSelectedWall: (value: string) => void;
  onWallChanged: (value: string) => void;
}

export default function SelectWall({
  selectedWall,
  setSelectedWall,
  onWallChanged,
}: SWInterface): React.JSX.Element {
  const listRef = React.useRef<FlatList>(null);

  const intl = useIntl();
  const { locale } = useLocale();

  const isRTL = locale === 'he' || locale === 'ar';

  React.useEffect(() => {
    if (isRTL) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({
          animated: false,
        });
      });
    }
  }, [isRTL]);

  const walls = [
    {
      key: 'Mathematics',
      iconActive: require('../../../../assets/icons/dart/Mathematics.png'),
      iconInactive: require('../../../../assets/icons/white/Mathematics.png'),
      label: `lang.${locale}.mathematics`,
    },
    {
      key: 'Physics',
      iconActive: require('../../../../assets/icons/dart/Physics.png'),
      iconInactive: require('../../../../assets/icons/white/Physics.png'),
      label: `lang.${locale}.physics`,
    },
    {
      key: 'Both',
      iconActive: require('../../../../assets/icons/dart/Math_Physics.png'),
      iconInactive: require('../../../../assets/icons/white/Math_Physics.png'),
      label: `lang.${locale}.maths_physics`,
    },
    {
      key: 'MyOnly',
      iconActive: require('../../../../assets/icons/dart/My_Only_Question.png'),
      iconInactive: require('../../../../assets/icons/white/My_Only_Question.png'),
      label: `lang.${locale}.my_own_questions`,
    },
    {
      key: 'AllQuestion',
      iconActive: require('../../../../assets/icons/dart/All_Questions.png'),
      iconInactive: require('../../../../assets/icons/white/All_Questions.png'),
      label: `lang.${locale}.all_questions`,
    },
  ];

  const onWallChange = (value: string) => {
    setSelectedWall(value);
    onWallChanged(value);
  };

  const renderItem = ({ item }: any) => {
    const isSelected = selectedWall === item.key;

    return (
      <Pressable
        onPress={() => onWallChange(item.key)}
        style={styles.scrollItem}
      >
        <View
          style={[
            styles.shadowItem,
            { backgroundColor: isSelected ? '#04939E' : '#FFF' },
          ]}
        >
          <Image
            source={isSelected ? item.iconActive : item.iconInactive}
            style={styles.itemImage}
          />
          <TextPopp4Regular
            style={[styles.itemText, { color: isSelected ? '#FFF' : '#000' }]}
          >
            {intl.formatMessage({ id: item.label })}
          </TextPopp4Regular>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <TextMont4Normal style={styles.topText}>
        {intl.formatMessage({ id: `lang.${locale}.select_the_wall` })}
      </TextMont4Normal>

      <FlatList
        data={isRTL ? walls.reverse() : walls}
        ref={listRef}
        horizontal
        keyExtractor={item => item.key}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        inverted={isRTL}
        contentContainerStyle={styles.flatListContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topText: {
    color: '#04939E',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'uppercase',
  },
  shadowItem: {
    alignItems: 'center',
    borderRadius: 10,
    width: 100,
    height: 100,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // Android
    elevation: 4,
  },
  flatListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scrollItem: {
    marginHorizontal: 10,
    direction: 'ltr',
  },
  itemImage: {
    width: 60,
    height: 60,
    marginTop: 5,
    resizeMode: 'contain',
  },
  itemText: {
    marginTop: 5,
    fontSize: 9,
    backgroundColor: 'transparent',
  },
});
