import React from 'react';
import {ScrollView,StyleSheet} from 'react-native';
//Componentes que se van sumando a mi pantalla principal
import WellnessRemindersView from './src/components/WellnessRemindersView';
import DailyProgressView from './src/components/DailyProgressView';
import DailyTipsView from './src/components/DailyTipsView';
import Home from './src/react-native-elements/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirebaseLeer from './src/firebase-crud/FirebaseLeer';
import FirebaseGuardar from './src/firebase-crud/FirebaseGuardar';
import FirebaseBorrar from './src/firebase-crud/FirebaseBorrar';
import FirebaseEditar from './src/firebase-crud/FirebaseEditar';
import FirebaseLogin from './src/firebase-login/FirebaseLogin';
import FirebaseRecuperarCuenta from './src/firebase-login/FirebaseRecuperarCuenta';
import FirebaseCrearCuenta from './src/firebase-login/FirebaseCrearCuenta';



const Stack = createNativeStackNavigator();

const App = () =>{
  return (
   
       <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="WellnessRemindersView" component={WellnessRemindersView} />
            <Stack.Screen name="DailyProgressView" component={DailyProgressView} />
            <Stack.Screen name="DailyTipsView" component={DailyTipsView} />
            <Stack.Screen name="FirebaseLeer" component={FirebaseLeer} />
            <Stack.Screen name="FirebaseGuardar" component={FirebaseGuardar} />
            <Stack.Screen name="FirebaseBorrar" component={FirebaseBorrar}/>
            <Stack.Screen name="FirebaseEditar" component={FirebaseEditar}/>
            <Stack.Screen name="FirebaseLogin" component={FirebaseLogin}/>
            <Stack.Screen name="FirebaseRecuperarCuenta" component={FirebaseRecuperarCuenta}/>
            <Stack.Screen name="FirebaseCrearCuenta" component={FirebaseCrearCuenta}/>
          </Stack.Navigator>
       </NavigationContainer>


  );
}
const styles = StyleSheet.create({
});

export default App;

