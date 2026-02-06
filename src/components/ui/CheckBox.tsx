import { StyleSheet, Pressable, Image } from "react-native";

function CustomCheckBox({ onChange, checked }: { onChange: any, checked: boolean }) {
    return (
      <Pressable
        style={[styles.checkboxBase, checked && styles.checkboxChecked]}
        onPress={onChange}>
        {checked && <Image source={require('../../../assets/images/check.png')} />}
      </Pressable>
    );
}

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: 'transparent',
    },
})

export default CustomCheckBox;