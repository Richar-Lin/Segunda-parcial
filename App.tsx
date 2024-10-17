import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import PushNotification from 'react-native-push-notification';
import AuthForms from './src/segunda-parcial/AuthForms';
import MainView from './src/segunda-parcial/MainView';
import DailyProgressView from './src/segunda-parcial/DailyProgress';
import DailyTipsView from './src/segunda-parcial/DailyTips';
import WellnessRemindersView from './src/segunda-parcial/WellnessRemindersView';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    
    // Configure push notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create a notification channel for Android
    PushNotification.createChannel(
      {
        channelId: "wellness-reminders",
        channelName: "Wellness Reminders",
        channelDescription: "Reminders for wellness activities",
        playSound: true,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`CreateChannel returned '${created}'`)
    );

    return subscriber; // unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthForms} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainView} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="DailyProgress" 
              component={DailyProgressView} 
              options={{ title: 'Progreso Diario' }}
            />
            <Stack.Screen 
              name="DailyTips" 
              component={DailyTipsView} 
              options={{ title: 'Consejos Diarios' }}
            />
            <Stack.Screen 
              name="WellnessReminders" 
              component={WellnessRemindersView} 
              options={{ title: 'Recordatorios de Bienestar' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;