
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useIntl } from "react-intl";

import { TextMont4Normal, TextMont7Bold, useLocale } from "../../../components";

export default function Verification(): React.JSX.Element {

    const intl = useIntl();
    const { locale } = useLocale();

    return (
        <View style={styles.container}>
            <Image source={require('../../../../assets/images/verification.png')} style={styles.image} />
            <TextMont7Bold style={styles.headerText}>
                { intl.formatMessage({ id: `auth.label.OTP_verification` }) }
            </TextMont7Bold>
            <TextMont4Normal style={styles.contentText}>
                { intl.formatMessage({ id: `lang.${locale}.otp_verification` }) }
            </TextMont4Normal>
            <Image source={require('../../../../assets/images/step3.png')} />
        </View>
    )
}

const styles = StyleSheet.create({ 
    container: {
        height: '100%', 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        gap: 20, 
        paddingBottom: 50
    }, 
    image: {
        flex: 1, 
        width: '80%', 
        maxWidth: 340, 
        maxHeight: 260, 
        resizeMode: 'contain'
    },
    headerText: {
        fontSize: 20, 
        color: "#1485A3", 
        textAlign: 'center'
    }, 
    contentText: {
        fontSize: 14, 
        color: "#6A6A6A", 
        paddingLeft: 40,
        paddingRight: 40, 
        textAlign: "center", 
        lineHeight: 24
    }
 })