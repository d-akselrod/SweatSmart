import {View, StyleSheet, Text} from 'react-native';

interface IOnboardingItem {
    item: { id: number, title: string, description: string }
}
function OnboardingItem({item} : IOnboardingItem) {
    return (
        <View style = {styles.container}>
            <Text>{item.title}</Text>
        </View>
    );
}

export default OnboardingItem;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})