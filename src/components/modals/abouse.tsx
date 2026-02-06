

import { Image, Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import { useIntl } from "react-intl";

import { CustomButton, TextMont4Normal, useLocale, useUser, useQuestion, initialAbuseType } from "..";
import { getFetchData, updateFetchData } from "../../utils/fetchData";
import { ST_SUCCESS } from "../../utils/constants";


export default function AbuseModal( ): React.JSX.Element {
    
    const intl = useIntl();
    const { locale } = useLocale();

    const { userData } = useUser();
    const { selAbuse, setSelAbuseData, setUpdateQuestionItem } = useQuestion();

    const [ isFetching, setIsFetching ] = useState<boolean>(false);
    
    
    const onAbuseConfirmPressed = async () => {
        
        const reqData = {
            abused_user_id: userData.id
        }
        setIsFetching( true );

        try {
            let result;

            if( selAbuse.sort === "answer" ) {
                result = await updateFetchData(`answer/${selAbuse.id}`, reqData);
            } else {
                result = await updateFetchData(`question/${selAbuse.id}`, reqData);
            }

            if(result && result.status === ST_SUCCESS) {

                let user_id = result.question.user_id;
                if( selAbuse.sort === "answer" ) {
                    user_id = result.answer.user_id;
                }

                await getFetchData(`notify/sendPushNotification?sort=abuse_${selAbuse.sort}&locale=${locale}&field_of_interest=${userData?.field_of_interest}&user_id=${user_id}`);

                ToastAndroid.show(intl.formatMessage({ id: `lang.${locale}.report_abuse_success` }), ToastAndroid.SHORT);

                setUpdateQuestionItem( result.question, true );
                setSelAbuseData(initialAbuseType);
            }

            setIsFetching( false );

        } catch (error) {
            setIsFetching( false );
        }
    }


    return (
        <Modal
        isVisible={ !!selAbuse.id }
        backdropColor='rgba(1, 90, 128, 0.9)'
    >
        <View style={styles.container}>
            <View style={styles.top}>
                <Pressable onPress={ () => setSelAbuseData(initialAbuseType) }>
                    <Image source={ require('../../../assets/images/modal_close.png') } style={styles.modalClose} />
                </Pressable>
            </View>
            <View style={styles.contentContainer}>
                <TextMont4Normal style={styles.header}>
                        { intl.formatMessage({ id: `lang.${locale}.confirming_abuse` }) }
                </TextMont4Normal>

                <View style={styles.content}>
                    <TextMont4Normal>
                        { intl.formatMessage({ id: `lang.${locale}.confirming_abuse_content` }) }
                    </TextMont4Normal>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={{ flex: 1 }}>
                        <CustomButton 
                            title={ intl.formatMessage({ id: "label.main.comfirm" }) }
                            onPress={ onAbuseConfirmPressed } 
                            size="small" 
                            isLoading={ isFetching }
                        />
                    </View>
                    
                    <View style={ { flex: 1 } }>
                        <CustomButton 
                            title={ intl.formatMessage({ id: "label.main.cancel" }) }
                            onPress={ () => setSelAbuseData(initialAbuseType) } 
                            size="small" 
                        />
                    </View>
                </View>
            </View>
        </View>
    </Modal>
    )
}



const styles = StyleSheet.create({
    container: {

    }, 
    top: {
        justifyContent: 'flex-end', 
        display: 'flex', 
        flexDirection: 'row', 
    }, 
    modalClose: {
        width: 35, 
        height: 35
    }, 
    contentContainer: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 20, 
        marginHorizontal: 20, 
        minHeight: 300
    }, 
    header: {
        backgroundColor: '#F4F4F4', 
        color: '#000', 
        textAlign: 'center', 
        fontSize: 18, 
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20, 
        paddingVertical: 10
    }, 
    content: {
        paddingHorizontal: 20, 
        paddingVertical: 20, 
        flex: 1
    }, 
    developer: {
        height: 250, 
        textAlignVertical: 'top', 
        fontSize: 16
    },
    // page header



    bottomContainer: {
        borderTopWidth: 1, 
        borderTopColor: '#1485A3', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        gap: 10
    }, 
    buttonContainer: {
        width: 100
    }, 
    iconContainer: {
        flexDirection: 'row', 
        gap: 10
    }, 
    roundContainer: {
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F4F4F4', 
        borderRadius: 18
    }, 
    icon: {
        width: 25, 
        height: 25, 
        resizeMode: 'contain'
    }
})