import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StyleProp,
  PressableProps,
  ViewStyle,
  View,
} from 'react-native';
import { TextMont4Normal } from '..';

type Props = {
  onPress: any;
  title: any;
  size?: string;
  icon?: string;
  color?: 'teal' | 'blue';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const CustomButton = ({
  onPress,
  title,
  size,
  icon,
  isLoading,
  color = 'teal',
  style = {},
}: Props) => {
  const colors = {
    blue: '#004869',
    teal: '#04939E',
  };

  return (
    <Pressable
      style={[
        { backgroundColor: colors[color] },
        size === 'small' ? [styles.buttonSM, style] : [styles.button, style],
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="white"
          style={{ height: 25 }}
          animating={true}
        />
      ) : size === 'small' ? (
        <View style={styles.buttonIcon}>
          {icon === 'flight' && (
            <Image
              source={require(`../../../assets/images/flight.png`)}
              style={styles.iconSize}
            />
          )}
          {icon === 'abuse' && (
            <Image
              source={require('../../../assets/images/abuse.png')}
              style={{ width: 17, height: 17 }}
            />
          )}
          <TextMont4Normal style={styles.textSM}>
            &nbsp;
            {title}
          </TextMont4Normal>
        </View>
      ) : (
        <View style={styles.buttonIcon}>
          {icon === 'flight' && (
            <Image
              source={require(`../../../assets/images/flight.png`)}
              style={styles.iconSize}
            />
          )}
          {icon === 'abuse' && (
            <Image
              source={require('../../../assets/images/abuse.png')}
              style={{ width: 17, height: 17 }}
            />
          )}
          <TextMont4Normal style={styles.text}>
            &nbsp;
            {title}
          </TextMont4Normal>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
  },
  buttonIcon: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  buttonSM: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: 0.25,
    color: 'white',
    textAlign: 'center',
  },
  textSM: {
    fontSize: 12,
    lineHeight: 25,
    letterSpacing: 0.25,
    color: 'white',
    alignItems: 'center',
  },

  iconSize: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
});

export default CustomButton;
