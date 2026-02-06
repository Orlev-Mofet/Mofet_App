

import React, { useState, useEffect, ChangeEvent } from 'react';
import { ImageBackground, StyleSheet, Pressable, View, Image, Text  } from 'react-native';

import {
    useIntl,
} from "react-intl";

import { SK_AGREE_POLICY } from '../../utils/constants';
import { CustomButton, CustomCheckBox, TextMont4Normal } from '../../components';
import { storeStorageData } from '../../utils/localStorage';

export default function Agree({ navigation }: {navigation: any}) : React.JSX.Element {

    const intl = useIntl();
    const [ isChecked, setIsChecked ] = useState(false);

    const onAgree = () => {

        storeStorageData(SK_AGREE_POLICY, `${+isChecked}`);


        navigation.navigate('register');
    }

    const handleCheckBoxClick = () => {
        setIsChecked( !isChecked )
    }

    const onPrAPoPressed = () => {
        navigation.navigate('privacy_policy');
    }

    return (
        <ImageBackground source={require('../../../assets/images/Splash.png')} style={styles.image} >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image source={require('../../../assets/images/logo.png')} />
                    <Image source={require('../../../assets/images/logo-text.png')} />
                </View>

                <View style={styles.bottom}>
                    <View style={styles.checkboxLine}>
                        <CustomCheckBox 
                            onChange={handleCheckBoxClick}
                            checked={isChecked}
                        />
                        <TextMont4Normal style={ styles.checkboxText }>
                            {intl.formatMessage({ id: "auth.label.Ihaveread" })}
                        </TextMont4Normal>
                        <TextMont4Normal style={styles.privacypolicy} onPress={onPrAPoPressed}>
                            {intl.formatMessage({ id: "auth.label.privacypolicy" })}
                        </TextMont4Normal>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton title={ intl.formatMessage({ id: "auth.label.Agree" }) } onPress={onAgree} />
                    </View>
                    <View style={styles.bottomLine}></View>
                </View>
            </View>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center", 
    }, 
    container: {
      backgroundColor: "#015A80", 
      opacity: 0.9,
      flex: 1
    }, 
    content: {
        height: '80%', 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        gap: 50, 
    }, 


    bottom: {
        justifyContent: "center", 
        alignItems: "center", 
        gap: 20, 
    }, 
    buttonContainer: {
        width: '80%'
    }, 
    text: {
        color: "white", 
        textAlign: "center", 
        fontSize: 14
    }, 
    checkbox: {
        margin: 8, 
        borderWidth: 2,
        borderColor: 'black',
        
    }, 
    bottomLine: {
        height: 4, 
        width: 126, 
        borderRadius: 6,
        backgroundColor: "#FFFFFF", 
        marginBottom: 10
    }, 
    checkboxLine: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 2, 
        width: '80%', 
        flexWrap: 'wrap', 
    }, 
    privacypolicy: {
        textDecorationLine: 'underline', 
        color: '#FFFFFF', 
        lineHeight: 20,
        fontSize: 14, 
        flexWrap: 'wrap'
    }, 
    checkboxText: {
        color: '#FFFFFF', 
        fontSize: 14, 
        marginLeft: 10,
        lineHeight: 20
    }
});



