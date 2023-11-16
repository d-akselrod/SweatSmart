import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8F1FF',
  },

  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8F1FF',
    flex: 2,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },

  title: {
    fontSize: 35,
    fontWeight: '600',
    color: '#4e9ccc',
  },

  form: {
    gap: 20,
    alignItems: 'center',
    flex: 5,
    paddingLeft: 24.5,
    paddingRight: 24.5,
    paddingTop: 50,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
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

  registerContainer: {
    flexDirection: 'row',
  },

  loginTitle: {
    fontSize: 25,
    alignSelf: 'flex-start',
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
  },

  error: {
    backgroundColor: '#ffcccb',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  errorMsg: {
    color: '#e74341',
    fontWeight: '500',
  },
});
