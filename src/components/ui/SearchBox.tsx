import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIntl } from 'react-intl';

import { useLocale } from '..';

export default function CustomSearchBox({
  value,
  onSearch,
  onClear,
}: {
  value: string;
  onSearch: any;
  onClear: any;
}) {
  const intl = useIntl();
  const { locale } = useLocale();

  return (
    <View style={styles.container}>
      <Image
        style={styles.searchIcon}
        source={require('../../../assets/images/search.png')}
      />
      <TextInput
        style={styles.textInput}
        placeholder={intl.formatMessage({
          id: `lang.${locale}.please_type_here`,
        })}
        value={value}
        onChangeText={(val: string) => onSearch(val)}
      />
      {value.length > 0 ? (
        <Text style={styles.textClear} onPress={onClear}>
          {intl.formatMessage({ id: 'label.main.clear' })}
        </Text>
      ) : (
        <View style={{ width: 33 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.2)',
    borderRadius: 10,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    width: 15,
    height: 15,
    objectFit: 'contain',
  },
  textInput: {
    width: '70%',
    fontSize: 14,
    color: '#000000',
  },
  textClear: {
    color: '#04939E',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
