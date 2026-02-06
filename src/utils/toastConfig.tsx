import React from 'react';
import Toast, {
  BaseToast,
  BaseToastProps,
  ToastConfig,
} from 'react-native-toast-message';

const toastProps: BaseToastProps = {
  text1Style: {
    fontSize: 16,
  },
  text2Style: {
    fontSize: 14,
  },
  text2NumberOfLines: 0,
  style: {
    height: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
};

export const toastConfig: ToastConfig = {
  success: props => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[toastProps.style, {borderLeftColor: '#69C779'}]}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[
        toastProps.style,
        {
          borderLeftColor: '#FE6301',
        },
      ]}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[
        toastProps.style,
        {
          borderLeftColor: '#FFC107',
        },
      ]}
    />
  ),
};
