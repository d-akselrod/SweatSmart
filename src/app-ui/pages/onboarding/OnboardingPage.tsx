import { useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { data } from './data';
import { OnboardingItem } from './OnboardingItem';
import { RootStackParamList } from '../../App';
import Paginator from '../../components/Paginator';
import { setActiveUser } from '../../redux/slices/userSlice';

export function OnboardingPage() {
  const route = useRoute<RouteProp<RootStackParamList, 'OnboardingPage'>>();
  const activeUser = route.params.user;

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<FlatList | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const { width } = useWindowDimensions();
  const [x, setX] = useState(0);

  const dispatch = useDispatch();

  const widthAnimated = scrollX.interpolate({
    inputRange: [width, width * 2, width * 3],
    outputRange: [30, 30, 200],
  });

  const opacity = scrollX.interpolate({
    inputRange: [width, width * 2, width * 3 * 0.98, width * 3],
    outputRange: [1, 1, 0, 1],
  });

  const handleSlide = () => {
    if (currentIndex + 1 < data.length) {
      slideRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else if (currentIndex == data.length - 1) {
      // @ts-ignore
      dispatch(setActiveUser(activeUser));
    }
  };

  const handleScroll = (event: any) => {
    setX(event.nativeEvent.contentOffset.x);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        keyExtractor={item => item.id.toString()}
        ref={slideRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll },
        )}
        onMomentumScrollEnd={event => {
          setCurrentIndex(
            Math.floor(
              Math.floor(event.nativeEvent.contentOffset.x) /
                Math.floor(event.nativeEvent.layoutMeasurement.width),
            ),
          );
        }}
        viewabilityConfig={viewConfig}
      />
      <Paginator data={data} scrollX={scrollX} />
      <TouchableOpacity style={[styles.button]} onPress={handleSlide}>
        <Animated.View
          style={{ width: widthAnimated, alignItems: 'center', opacity }}
        >
          {x < width * 3 * 0.98 ? (
            <AntDesign name='arrowright' size={24} color='white' />
          ) : (
            <Animated.Text style={styles.start}>Get Started</Animated.Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#1a2264',
    borderRadius: 40,
    marginBottom: 50,
  },

  start: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
});
