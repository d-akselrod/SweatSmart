import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        gap: 20,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#6C96E8',
        borderRadius: 30,
        padding: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    
    loginContainer: {
        flexDirection: "row",
        alignItems: 'center',
    }
})