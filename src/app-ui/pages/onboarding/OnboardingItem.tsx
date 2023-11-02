import {
  View,
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  Dimensions,
} from 'react-native';

interface IOnboardingItem {
  item: { id: number; title: string; description: string; image: any };
}
function OnboardingItem({ item }: IOnboardingItem) {
  return (
    <View style={[styles.container, { width: Dimensions.get('window').width }]}>
      <Image
        source={item.image}
        style={[
          styles.image,
          { width: Dimensions.get('window').width, resizeMode: 'contain' },
        ]}
      />
      <View style={{ flex: 0.4 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  image: {
    flex: 0.6,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a2264',
  },

  description: {
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
