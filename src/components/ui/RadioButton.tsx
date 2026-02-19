import React from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';

interface CRBInterface {
    selected: boolean, 
    onPress: (value: string) => void, 
    label: string, 
    keyValue: string
}

export default function CustomRadioButton ({ selected, onPress, label, keyValue }: CRBInterface): React.JSX.Element {

    return (
        <TouchableOpacity onPress={() => onPress( keyValue )}>
            <View style={{ 
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', 
                alignItems: 'center', 
                minWidth: 100
            }}>
                <View
                    style={{
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: selected ? '#04939E' : '#707070',
                        alignItems: 'center',
                        justifyContent: 'center', 
                    }}
                >
                    {selected ? (
                    <View
                        style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#04939E',
                        }}
                    />
                    ) : null}
                </View>
                <Text style={{ 
                    color: selected ? '#04939E' : '#707070', 
                    textTransform: 'uppercase',
                    fontSize: 12, 
                    fontFamily: 'Montserrat-Medium', 
                    marginHorizontal: 8
                 }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}