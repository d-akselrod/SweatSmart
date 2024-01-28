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
import { RegisterPage } from './pages/register/RegisterPage';
import { SocialPage } from './pages/social/SocialPage';
import { IUser } from './typings/types';
import { EntryPage } from '../app-ui/pages/entry/EntryPage';
import { debugstore, store } from '../app-ui/redux/store';

const debugRedux = false;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EmptyPage = () => <></>;

export type RootStackParamList = {
  OnboardingPage: {
    user: IUser;
  };
};

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
    <NavigationContainer>
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
          component={ProfilePage}
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
    </NavigationContainer>
  );
};

const App = () => {
  const activeUser: IUser = useSelector((state: any) => state.user);

  return activeUser == undefined ? <AppEntry /> : <AppMain />;
};

export default function Root() {
  return (
    <Provider store={debugRedux ? debugstore : store}>
      <App />
    </Provider>
  );
}
