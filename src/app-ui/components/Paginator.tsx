import {View, StyleSheet} from 'react-native'

function Paginator({data, index} : any) {
    return (
        <View style = {styles.container}>
            {data.map((_ : any, i : number) => {
                return <View style = {[styles.dot, {opacity: index === i ? 1 : 0.3}]} key = {i}/>
            })}
        </View>
    );
}

export default Paginator;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 15,
        height: 64
    },
    
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#3c93e0',
    }
})
