import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { ChatBotPage } from './pages/chatbot/ChatBotPage';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/login/LoginPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { AboutPage } from './pages/profile/subpages/AboutPage';
import { AccountSettingsPage } from './pages/profile/subpages/AccountSettingsPage';
import { AppUsagePage } from './pages/profile/subpages/AppUsagePage';
import { EditProfilePage } from './pages/profile/subpages/EditProfilePage';
import { HelpPage } from './pages/profile/subpages/HelpPage';
import { NotificationsPage } from './pages/profile/subpages/NotificationsPage';
import { TermsOfServicePage } from './pages/profile/subpages/TermsOfServicePage';
import { RegisterPage } from './pages/register/RegisterPage';
import { SocialPage } from './pages/social/SocialPage';
import { IUser } from './typings/types';
import { EntryPage } from '../app-ui/pages/entry/EntryPage';
import { debugstore, store } from '../app-ui/redux/store';
import { ExercisePage } from './pages/home/ExercisePage';
import { WorkoutExercisesPage } from './pages/home/WorkoutExercisesPage';
import { AddWorkout } from './pages/home/AddWorkout';
import { AddExercisesPage } from './pages/home/AddExercisesPage';
import { ExerciseDetailsPage } from './pages/home/ExerciseDetailsPage';
import { StartWorkoutPage } from './pages/home/StartWorkoutPage';

const debugRedux = false;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="HomePage" screenOptions = {{presentation: 'card'}}>
        <Stack.Screen name="HomePage" component={AppMain} options = {{headerShown: false}}/>
        <Stack.Screen name="ExerciseList" component={ExercisePage} options = {{headerShown: true}}/>
        <Stack.Screen name="WorkoutExerciseList" component={WorkoutExercisesPage} options = {{headerShown: true}} />
        <Stack.Screen name="WorkoutPage" component={AddWorkout} options = {{headerShown: true, title: "Add Workout", headerBackTitle: 'Home'}}/>
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsPage} options = {{headerShown: false}}/>
        <Stack.Screen name="StartWorkout" component={StartWorkoutPage} options = {{headerShown: false}}/>
      {/*<Stack.Screen name="AddExercisePage" component={AddExercisesPage} options = {{headerShown: false, presentation: 'modal'}}/>*/}
    </Stack.Navigator>
  </NavigationContainer>
);

// const ExerciseStack = () => (
//   <Stack.Navigator initialRouteName="WorkoutExercise" screenOptions = {{presentation: "modal"}}>
//     <Stack.Screen name="WorkoutExercise" component={WorkoutExercisesPage} options = {{headerShown: false}}/>
//     <Stack.Screen name="AddExercisePage" component={EmptyPage} options = {{headerShown: false}}/>
//   </Stack.Navigator>
// )

function HomeTabs() {
  const iconSize = 40;
  const focusedIconColor = 'black';
  const unfocusedIconColor = 'grey';
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen
            name='ChatBot'
            component={ChatBotPage}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name='chatbubbles-outline'
                  size={iconSize}
                  color={focused ? focusedIconColor : unfocusedIconColor}
                />
              ),
            }}
          />
            <Tab.Screen name="Notifications" component={SocialPage} />
        </Tab.Navigator>
    );
}
const EmptyPage = () => <></>;

export type RootStackParamList = {
  OnboardingPage: {
    user: IUser;
  };
};

const ProfileStack = () => (
  <Stack.Navigator
    initialRouteName='Profile Page'
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name='Profile Page' component={ProfilePage} />
    <Stack.Screen name='Edit Profile' component={EditProfilePage} />
    <Stack.Screen name='Account Settings' component={AccountSettingsPage} />
    <Stack.Screen name='Notifications' component={NotificationsPage} />
    <Stack.Screen name='App Usage' component={AppUsagePage} />
    <Stack.Screen name='About' component={AboutPage} />
    <Stack.Screen name='Help' component={HelpPage} />
    <Stack.Screen name='Terms of Service' component={TermsOfServicePage} />
  </Stack.Navigator>
);

const AppEntry = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName='Entry'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name='Entry' component={EntryPage} />
      <Stack.Screen name='Login' component={LoginPage} />
      <Stack.Screen name='Registration' component={RegisterPage} />
      <Stack.Screen name='OnboardingPage' component={OnboardingPage} />
    </Stack.Navigator>
  </NavigationContainer>
);

const AppMain = () => {
  const iconSize = 40;
  const focusedIconColor = 'black';
  const unfocusedIconColor = 'grey';
  return (
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name='ChatBot'
          component={ChatBotPage}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name='chatbubbles-outline'
                size={iconSize}
                color={focused ? focusedIconColor : unfocusedIconColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Progress'
          component={EmptyPage}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name='trending-up-outline'
                size={iconSize}
                color={focused ? focusedIconColor : unfocusedIconColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Home'
          component={HomePage}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name='barbell-outline'
                size={iconSize}
                color={focused ? focusedIconColor : unfocusedIconColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileStack}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name='person-outline'
                size={iconSize}
                color={focused ? focusedIconColor : unfocusedIconColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Social'
          component={SocialPage}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name='people-outline'
                size={iconSize}
                color={focused ? focusedIconColor : unfocusedIconColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
};

const App = () => {
  const activeUser: IUser = useSelector((state: any) => state.user);

  return activeUser == undefined ? <AppEntry /> : <HomeStack />;
};

export default function Root() {
  return (
    <Provider store={debugRedux ? debugstore : store}>
      <App />
    </Provider>
  );
}
