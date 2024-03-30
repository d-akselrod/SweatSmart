import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { generateWorkout } from '../../service/WorkoutAPI';

interface IChoseWorkoutTypeProps {
  close: Function;
}
export const ChoseWorkoutType = (props: IChoseWorkoutTypeProps) => {
  const { close } = props;
  const [option, setOption] = useState<number | undefined>(undefined);
  const navigation = useNavigation();
  const activeUser = useSelector((state: any) => state.user);

  const handleGenerateWorkout = async () => {
    try {
      if (option == undefined) return;

      const response = await generateWorkout(activeUser.username, option);
      if (response.ok) {
        const data = await response.json();
        navigation.goBack();
      } else {
        const data = await response.json();
        console.log('ERROR HAS OCCURED!');
      }
    } catch (e) {
      console.log('wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => close()}
        style={{ alignSelf: 'flex-start', marginLeft: 15 }}
      >
        <AntDesign name='close' size={24} color='black' />
      </Pressable>
      <View id='workout-options'>
        <View style={styles.optionsContainerRow}>
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 0 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(0)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/fullBody.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Full Body Workout</Text>
              <View style={styles.radioButton}>
                {option === 0 && <View style={styles.selectedRadioButton} />}
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 1 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(1)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/upperBodyPush.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Upper Body Push</Text>
              <View style={styles.radioButton}>
                {option === 1 && <View style={styles.selectedRadioButton} />}
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.optionsContainerRow}>
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 2 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(2)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/upperBodyPull.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Upper Body Pull</Text>
              <View style={styles.radioButton}>
                {option === 2 && <View style={styles.selectedRadioButton} />}
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { borderColor: option === 3 ? '#A9ABF1' : 'white' },
            ]}
            onPress={() => setOption(3)}
          >
            <Image
              style={{ height: '45%', width: '70%' }}
              source={require('../../assets/images/lowerBody.png')}
            />
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.text}>Lower Body</Text>
              <View style={styles.radioButton}>
                {option === 3 && <View style={styles.selectedRadioButton} />}
              </View>
            </View>
          </Pressable>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: option == undefined ? '#4e547e' : '#7F87CD',
          borderRadius: 10,
          width: '80%',
          bottom: 0,
        }}
        disabled={option == undefined}
        onPress={() => handleGenerateWorkout()}
      >
        <Text
          style={[
            styles.buttonTitle,
            {
              color: option === undefined ? '#ffffff50' : '#ffffff',
            },
          ]}
        >
          {'Generate Workout'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },
  optionsContainerRow: {
    flexDirection: 'row',
    marginVertical: 20,
    width: '100%',
    height: '40%',
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#A9ABF1',
  },
  text: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '200',
  },
  button: {
    width: '40%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 2,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    padding: 15,
    color: '#ffffff50',
    textAlign: 'center',
  },
});
