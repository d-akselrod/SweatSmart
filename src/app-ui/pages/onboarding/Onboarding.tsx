import {View, StyleSheet, FlatList, SafeAreaView, Text, ViewToken} from 'react-native';
import OnboardingItem from './OnboardingItem';
import data from './data';
import {useRef, useState } from 'react';
import Paginator from '../../components/Paginator'


function Onboarding(props: any) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const slideRef = useRef<FlatList | null>(null)
    return (
        <SafeAreaView style = {styles.container}>
            <View>
                <FlatList
                    data = {data}
                    renderItem = {({item}) => <OnboardingItem item = {item} />}
                    horizontal
                    showsHorizontalScrollIndicator = {false}
                    bounces = {false}
                    pagingEnabled
                    keyExtractor = {(item) => item.id.toString()}
                    ref ={slideRef}
                    onMomentumScrollEnd={(event) => {
                        setCurrentIndex(Math.floor(
                            Math.floor(event.nativeEvent.contentOffset.x) /
                            Math.floor(event.nativeEvent.layoutMeasurement.width)
                        ));
                    }}
                />
            </View>
            <Paginator data = {data} index = {currentIndex}/>
        </SafeAreaView>
    );
}

export default Onboarding;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
})