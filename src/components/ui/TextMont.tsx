
import React from 'react';
import { Text as DefaultText, StyleSheet } from 'react-native';

const TextMont9Black = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont9Black, props.style]} />;
};

const TextMont8ExtraBold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont8ExtraBold, props.style]} />;
};

const TextMont7Bold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont7Bold, props.style]} />;
};

const TextMont6SemiBold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont6SemiBold, props.style]} />;
};

const TextMont5Medium = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont5Medium, props.style]} />;
};

const TextMont4Normal = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont4Normal, props.style]} />;
};

const TextMont3Light = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont3Light, props.style]} />;
};

const TextMont2ExtraLight = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont2ExtraLight, props.style]} />;
};

const TextMont1Thin = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextMont1Thin, props.style]} />;
};


// font-thin        : Sets the font weight to 100.
// font-extralight  : Sets the font weight to 200.
// font-light       : Sets the font weight to 300.
// font-normal      : Sets the font weight to 400.
// font-medium      : Sets the font weight to 500.
// font-semibold    : Sets the font weight to 600.
// font-bold        : Sets the font weight to 700.
// font-extrabold   : Sets the font weight to 800.
// font-black       : Sets the font weight to 900.

const styles = StyleSheet.create({
    TextMont9Black: {
        fontFamily: 'Montserrat-Black'
    }, 
    TextMont8ExtraBold: {
        fontFamily: 'Montserrat-ExtraBold'
    }, 
    TextMont7Bold: {
        fontFamily: 'Montserrat-Bold'
    }, 
    TextMont6SemiBold: {
        fontFamily: 'Montserrat-SemiBold'
    }, 
    TextMont5Medium: {
        fontFamily: 'Montserrat-Medium'
    }, 
    TextMont4Normal: {
        // fontFamily: 'Montserrat-Regular'
        fontFamily: 'Montserrat-Medium'
    }, 
    TextMont3Light: {
        fontFamily: 'Montserrat-Light'
    }, 
    TextMont2ExtraLight: {
        fontFamily: 'Montserrat-ExtraLight'
    }, 
    TextMont1Thin: {
        fontFamily: 'Montserrat-Thin'
    }, 
});


export {
    TextMont1Thin, 
    TextMont2ExtraLight, 
    TextMont3Light, 
    TextMont4Normal, 
    TextMont5Medium, 
    TextMont6SemiBold, 
    TextMont7Bold, 
    TextMont8ExtraBold, 
    TextMont9Black, 
}