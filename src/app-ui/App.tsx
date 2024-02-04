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
import { ProgressPage } from './pages/progress/ProgressPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { AboutPage } from './pages/settings/subpages/AboutPage';
import { AccountSettingsPage } from './pages/settings/subpages/AccountSettingsPage';
import { AppUsagePage } from './pages/settings/subpages/AppUsagePage';
import { EditProfilePage } from './pages/settings/subpages/EditProfilePage';
import { HelpPage } from './pages/settings/subpages/HelpPage';
import { NotificationsPage } from './pages/settings/subpages/NotificationsPage';
import { TermsOfServicePage } from './pages/settings/subpages/TermsOfServicePage';
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

const SettingsStack = () => (
  <Stack.Navigator
    initialRouteName='Settings Page'
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name='Settings Page' component={SettingsPage} />
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
          component={ProgressPage}
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
          component={SettingsStack}
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
