import React, {useEffect, useRef} from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function ProgressBar() {
    const animate = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(animate, {
            toValue: 30,
            duration: 2000,
            useNativeDriver: false
        }).start();
    }, [])

    const progress = animate.interpolate({
        inputRange: [0, 30 + 1],
        outputRange: ["0%", 30 + 1 +'%']
    })

    return (
        <View style = {styles.bar}>
            <Animated.View style = {[styles.progress, {width: progress, backgroundColor: '#546cff'}]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    bar:{
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        height: 7
    },

    progress: {
        borderRadius: 5,
        height: '100%',
    }
})