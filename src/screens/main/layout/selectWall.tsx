import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { TextMont4Normal, TextPopp4Regular, useLocale } from "../../../components";
import { useIntl } from "react-intl";

interface SWInterface {
    selectedWall: string, 
    setSelectedWall: (value: string) => void, 
    onWallChanged: (value: string) => void
}

export default function SelectWall({ selectedWall, setSelectedWall, onWallChanged }: SWInterface): React.JSX.Element {
    
    const intl = useIntl();
    const { locale } = useLocale();


    const onWallChange = (value: string) => {
        setSelectedWall(value);
        onWallChanged(value);
    }


    return (
        
        <View>
            <TextMont4Normal style={styles.topText}>{ intl.formatMessage({ id: `lang.${locale}.select_the_wall` }) }</TextMont4Normal>
            <ScrollView 
                horizontal={true}
                contentContainerStyle={{paddingVertical: 10, paddingHorizontal: 10}}
                showsHorizontalScrollIndicator={false}
            >
                <TouchableOpacity style={styles.scrollItem} onPress={() => onWallChange('Mathematics')}>
                    <Shadow style={ [styles.shadowItem, {backgroundColor: (selectedWall === "Mathematics" ? "#00658F": "#FFF")}] } distance={5} >
                        {
                            selectedWall === "Mathematics" 
                            ? 
                            <Image source={ require("../../../../assets/icons/dart/Mathematics.png") } style={ [ styles.itemImage ] } />
                            :
                            <Image source={ require("../../../../assets/icons/white/Mathematics.png") } style={ [ styles.itemImage ] } />
                        }
                        <TextPopp4Regular style={ [styles.itemText, { color: (selectedWall === "Mathematics" ? "#FFF": "#000") }] }>{ intl.formatMessage({ id: `lang.${locale}.mathematics` }) }</TextPopp4Regular>
                    </Shadow>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scrollItem} onPress={() => onWallChange('Physics')}>
                    <Shadow style={ [styles.shadowItem, {backgroundColor: (selectedWall === "Physics" ? "#00658F": "#FFF")}] } distance={5} >
                        {
                            selectedWall === "Physics" 
                            ?
                            <Image source={ require("../../../../assets/icons/dart/Physics.png") } style={[styles.itemImage ]} />
                            :
                            <Image source={ require("../../../../assets/icons/white/Physics.png") } style={[styles.itemImage ]} />
                        }
                        <TextPopp4Regular style={ [styles.itemText, { color: (selectedWall === "Physics" ? "#FFF": "#000") }] }>{ intl.formatMessage({ id: `lang.${locale}.physics` }) }</TextPopp4Regular>
                    </Shadow>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scrollItem} onPress={() => onWallChange('Both')}>
                    <Shadow style={ [styles.shadowItem, {backgroundColor: (selectedWall === "Both" ? "#00658F": "#FFF")}] } distance={5} >
                        {
                            selectedWall === "Both" 
                            ?
                            <Image source={ require("../../../../assets/icons/dart/Math_Physics.png") } style={[styles.itemImage ]} />
                            :
                            <Image source={ require("../../../../assets/icons/white/Math_Physics.png") } style={[styles.itemImage ]} />
                        }
                        <TextPopp4Regular style={ [styles.itemText, { color: (selectedWall === "Both" ? "#FFF": "#000") }] }>{ intl.formatMessage({ id: `lang.${locale}.maths_physics` }) }</TextPopp4Regular>
                    </Shadow>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scrollItem} onPress={() => onWallChange('MyOnly')}>
                    <Shadow style={ [styles.shadowItem, {backgroundColor: (selectedWall === "MyOnly" ? "#00658F": "#FFF")}] } distance={5} >
                        {
                            selectedWall === "MyOnly" 
                            ?
                            <Image source={ require("../../../../assets/icons/dart/My_Only_Question.png") } style={ [styles.itemImage ] } />
                            :
                            <Image source={ require("../../../../assets/icons/white/My_Only_Question.png") } style={ [styles.itemImage ] } />
                        }
                        <TextPopp4Regular style={ [styles.itemText, { color: (selectedWall === "MyOnly" ? "#FFF": "#000") }] }>{ intl.formatMessage({ id: `lang.${locale}.my_own_questions` }) }</TextPopp4Regular>
                    </Shadow>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scrollItem} onPress={() => onWallChange('AllQuestion')}>
                    <Shadow style={ [styles.shadowItem, {backgroundColor: (selectedWall === "AllQuestion" ? "#00658F": "#FFF")}] } distance={5} >
                        {
                            selectedWall === "AllQuestion" 
                            ?
                            <Image source={ require("../../../../assets/icons/dart/All_Questions.png") } style={[styles.itemImage ]} />
                            :
                            <Image source={ require("../../../../assets/icons/white/All_Questions.png") } style={[styles.itemImage ]} />
                        }
                        <TextPopp4Regular style={ [styles.itemText, { color: (selectedWall === "AllQuestion" ? "#FFF": "#000") }] }>{ intl.formatMessage({ id: `lang.${locale}.all_questions` }) }</TextPopp4Regular>
                    </Shadow>
                </TouchableOpacity>
               
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    }, 
    topText: {
        color: "#00658f", 
        textAlign: 'center', 
        marginTop: 20, 
        textTransform: 'uppercase'
    }, 
    scrollItem: {
        marginHorizontal: 10
    }, 
    shadowItem: {
        alignItems: 'center', 
        borderRadius: 10, 
        width: 100, 
        height: 100, 
    }, 
    itemImage: {
        width: 60, 
        height: 60, 
        marginTop: 5, 
        resizeMode: 'contain', 
    }, 
    itemText: {
        marginTop: 5, 
        fontSize: 9, 
        backgroundColor: 'transparent', 
    }
});