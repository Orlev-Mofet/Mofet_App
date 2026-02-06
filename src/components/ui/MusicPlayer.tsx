
import { useEffect, useState } from "react";
import { I18nManager, Image, Pressable, StyleSheet, View } from "react-native"
import TrackPlayer, { RepeatMode, useProgress, useIsPlaying } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

import { setupPlayer } from "../../../trackPlayerServices";

import { TextPopp5Medium, TextPopp6SemiBold } from "..";

interface CMPInterface {
    uri: string,
    id: number
}

export default function CustomMusciPlayer({ uri, id }: CMPInterface) : React.JSX.Element {

    const { position, duration, buffered } = useProgress();
    const { playing, bufferingDuringPlay } = useIsPlaying();

    const [ isPlayerReady, setIsPlayerReady ] = useState<boolean>(false);
    const [ pos, setPos ] = useState<string>("0:00");
    const [ dur, setDur ] = useState<string>("0:00");
    const [ volumnValue, setVolumnValue ] = useState<number>(0.5);

    
    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    

    useEffect(() => {

        const setup = async () => {
            let isSetup = await setupPlayer();
    
            const queue = await TrackPlayer.getQueue();
            if(isSetup && queue.length <= 0) {
                await TrackPlayer.add([
                    {
                      id: `music_${id}`,
                      url: uri, 
                      title: 'Fluidity',
                      artist: 'tobylane',
                    }
                ]);
                await TrackPlayer.setRepeatMode(RepeatMode.Queue);
            }
            
            setIsPlayerReady(isSetup);
        }

        setup();
    }, [  ]);

    useEffect(() => {
        setPos(formatDuration(position));
        setDur(formatDuration(duration));
    }, [ duration, position ])

    const onPlayPressed = () => {
        if( !playing ) TrackPlayer.play();
        else if ( playing ) TrackPlayer.pause();
    }

    const onVolumnChanged = ( val: number ) => {
        setVolumnValue( val );
    }

    const onPositionChanged = ( val: number ) => {
        TrackPlayer.seekTo(val);
    }

    return (
        <View style={ styles.container }>
            <Pressable onPress={ onPlayPressed }>
                {
                    playing ? 
                    <Image source={ require('../../../assets/icons/main/pause.png') } style={ styles.playImage } />
                    :
                    <Image source={ require('../../../assets/icons/main/play.png') } style={ styles.playImage } />
                }
            </Pressable>
            <View style={ styles.timeLineContainer }>
                <TextPopp5Medium style={ styles.timelineText }> { pos } </TextPopp5Medium>
                <TextPopp6SemiBold style={{ fontSize: 12, color: '#FFFFFF', marginTop: 3 }}> / </TextPopp6SemiBold>
                <TextPopp5Medium style={ styles.timelineText }> { dur } </TextPopp5Medium>
            </View>
            <Slider
                style={{ height: 40, flex: 1 }}
                minimumValue={0}
                maximumValue={duration }
                value={ position }
                minimumTrackTintColor="#1485A3"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor="#1485A3"
                onValueChange={ onPositionChanged }
            />
            <Pressable>
                <Image source={ require('../../../assets/icons/main/sound.png') } style={ styles.soundImage } />
            </Pressable>
            <Slider
                style={{ minWidth: 80, height: 40 }}
                minimumValue={ 0 }
                maximumValue={ 1 }
                minimumTrackTintColor="#1485A3"
                maximumTrackTintColor="#FFFFFF"
                value={ volumnValue }
                onValueChange={ onVolumnChanged }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 10, 
        backgroundColor: '#B5B5B5', 
        minHeight: 40, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingLeft: I18nManager.isRTL ? 0: 10, 
        paddingRight: I18nManager.isRTL ? 10: 0, 
    }, 
    timeLineContainer:{
        flexDirection: 'row', 
        alignItems: 'center', 
    }, 
    timelineText: {
        fontSize: 14, 
        color: '#FFFFFF', 
        marginTop: 5, 
        width: 35
    }, 
    playImage: {
        width: 12, 
        height: 15
    }, 
    soundImage: {
        width: 17, 
        height: 17
    }
})