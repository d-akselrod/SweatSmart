import React from 'react';
import { EntryPage } from '../app-ui/pages/entry/EntryPage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '../app-ui/redux/store';
import RegisterPage from './pages/register/RegisterPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const EmptyPage = () => <></>;

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
    </Stack.Navigator>
  </NavigationContainer>
);

const AppMain = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name='ChatBot' component={EmptyPage} />
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
