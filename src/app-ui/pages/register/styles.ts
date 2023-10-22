import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    
    form: {
        gap: 20,
        alignItems: 'center'
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
    },

    registerTitle:{
        fontSize: 30,
        alignSelf: 'flex-start',
        fontWeight: '600',
        color: "#1d2d94"
    }
})