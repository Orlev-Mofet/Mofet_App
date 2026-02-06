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
} from 'react-native';
import {TextMont4Normal} from '..';

type Props = {
  onPress: any;
  title: any;
  size?: string;
  icon?: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const CustomButton = ({
  onPress,
  title,
  size,
  icon,
  isLoading,
  style = {},
}: Props) => {
  return (
    <Pressable
      style={[
        size === 'small' ? [styles.buttonSM, style] : [styles.button, style],
      ]}
      onPress={onPress}>
      {isLoading && (
        <ActivityIndicator
          size="small"
          color="white"
          style={{height: 25}}
          animating={true}
        />
      )}
      {!isLoading &&
        (size === 'small' ? (
          <TextMont4Normal style={styles.textSM}>
            {icon === 'flight' && (
              <Image
                source={require(`../../../assets/images/flight.png`)}
                style={styles.iconSize}
              />
            )}
            {icon === 'abuse' && (
              <Image
                source={require('../../../assets/images/abuse.png')}
                style={{width: 17, height: 17}}
              />
            )}
            &nbsp;
            {title}
          </TextMont4Normal>
        ) : (
          <TextMont4Normal style={styles.text}>
            {icon === 'flight' && (
              <Image
                source={require(`../../../assets/images/flight.png`)}
                style={styles.iconSize}
              />
            )}
            {icon === 'abuse' && (
              <Image
                source={require('../../../assets/images/abuse.png')}
                style={{width: 17, height: 17}}
              />
            )}
            &nbsp;
            {title}
          </TextMont4Normal>
        ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#1485A3',
    height: 50,
  },
  buttonSM: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#1485A3',
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
