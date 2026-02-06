
import React from 'react';
import { Text as DefaultText, StyleSheet } from 'react-native';

const TextPopp9Black = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp9Black, props.style]} />;
};

const TextPopp8ExtraBold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp8ExtraBold, props.style]} />;
};

const TextPopp7Bold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp7Bold, props.style]} />;
};

const TextPopp6SemiBold = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp6SemiBold, props.style]} />;
};

const TextPopp5Medium = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp5Medium, props.style]} />;
};

const TextPopp4Regular = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp4Regular, props.style]} />;
};

const TextPopp3Light = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp3Light, props.style]} />;
};

const TextPopp2ExtraLight = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp2ExtraLight, props.style]} />;
};

const TextPopp1Thin = ({...props}) => {
    return <DefaultText {...props} style={[styles.TextPopp1Thin, props.style]} />;
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
    TextPopp9Black: {
        fontFamily: 'Poppins-Black'
    }, 
    TextPopp8ExtraBold: {
        fontFamily: 'Poppins-ExtraBold'
    }, 
    TextPopp7Bold: {
        fontFamily: 'Poppins-Bold'
    }, 
    TextPopp6SemiBold: {
        fontFamily: 'Poppins-SemiBold'
    }, 
    TextPopp5Medium: {
        fontFamily: 'Poppins-Medium'
    }, 
    TextPopp4Regular: {
        // fontFamily: 'Poppins-Regular'
        fontFamily: 'Poppins-Medium'
    }, 
    TextPopp3Light: {
        fontFamily: 'Poppins-Light'
    }, 
    TextPopp2ExtraLight: {
        fontFamily: 'Poppins-ExtraLight'
    }, 
    TextPopp1Thin: {
        fontFamily: 'Poppins-Thin'
    }, 
});


export {
    TextPopp1Thin, 
    TextPopp2ExtraLight, 
    TextPopp3Light, 
    TextPopp4Regular, 
    TextPopp5Medium, 
    TextPopp6SemiBold, 
    TextPopp7Bold, 
    TextPopp8ExtraBold, 
    TextPopp9Black, 
}