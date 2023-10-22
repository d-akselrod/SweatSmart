import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    
    titleContainer: {
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#D8F1FF',
        flex: 6,
    },
    
    fulltitle: {
        flexDirection: 'row',
        justifyContent: "center",
        height: '100%',
        alignItems: 'center'
    },
    
    title: {
        fontSize: 40,
        fontWeight: '600',
        color: '#5a85a4'
    },
    
    form: {
        gap: 20,
        alignItems: 'center',
        marginTop: 28,
        marginHorizontal: 24.5,
        flex: 10
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
        fontSize: 25,
        alignSelf: 'flex-start',
        fontWeight: '600',
        color: "#6D6089"
    }
})