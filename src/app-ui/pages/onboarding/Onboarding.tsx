import {View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Text, Animated, useWindowDimensions} from 'react-native';
import OnboardingItem from './OnboardingItem';
import data from './data';
import {useRef, useState } from 'react';
import Paginator from '../../components/Paginator'


function Onboarding(props: any) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const slideRef = useRef<FlatList | null>(null)
    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current
    const {width} = useWindowDimensions();
    
    // const opacity = scrollX.interpolate({
    //     inputRange: [0, 0, 0],
    //     outputRange: []
    // })
    
    return (
        <SafeAreaView style = {styles.container}>
            <FlatList
                data = {data}
                renderItem = {({item}) => <OnboardingItem item = {item} />}
                horizontal
                showsHorizontalScrollIndicator = {false}
                bounces = {false}
                pagingEnabled
                keyExtractor = {(item) => item.id.toString()}
                ref ={slideRef}
                onScroll = {Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                    useNativeDriver: false
                })}
                onMomentumScrollEnd={(event) => {
                    setCurrentIndex(Math.floor(
                        Math.floor(event.nativeEvent.contentOffset.x) /
                        Math.floor(event.nativeEvent.layoutMeasurement.width)
                    ));
                }}
                viewabilityConfig = {viewConfig}
            />
            <Paginator data = {data} index = {currentIndex} scrollX = {scrollX}/>
            <TouchableOpacity style = {styles.button}>
                <Text style = {styles.start}>Start Your Journey</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Onboarding;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    button: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: '#1a2264',
        borderRadius: 40,
        marginBottom: 50
    },
    
    start: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    }
})