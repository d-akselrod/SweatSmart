import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { ChatBotPage } from './pages/chatbot/ChatBotPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { IUser } from './typings/types';
import { EntryPage } from '../app-ui/pages/entry/EntryPage';
import { store } from '../app-ui/redux/store';

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
      <Stack.Screen name='Login' component={EmptyPage} />
      <Stack.Screen name='Registration' component={RegisterPage} />
      <Stack.Screen name='OnboardingPage' component={OnboardingPage} />
    </Stack.Navigator>
  </NavigationContainer>
);

const AppMain = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name='ChatBot' component={ChatBotPage} />
      <Tab.Screen name='Profile' component={EmptyPage} />
      <Tab.Screen name='Home' component={EmptyPage} />
      <Tab.Screen name='Planner' component={EmptyPage} />
      <Tab.Screen name='Progress' component={EmptyPage} />
    </Tab.Navigator>
  </NavigationContainer>
);

const App = () => {
  const activeUser = useSelector((state: any) => state.user);
  return activeUser == undefined ? <AppEntry /> : <AppMain />;
};

export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
