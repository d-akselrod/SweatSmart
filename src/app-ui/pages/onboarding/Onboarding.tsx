import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import OnboardingItem from './OnboardingItem';
import data from './data';


function Onboarding(props: any) {
    return (
        <SafeAreaView style = {styles.container}>
            <FlatList data = {data} renderItem = {({item}) => <OnboardingItem item = {item} />} />
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
    }
})