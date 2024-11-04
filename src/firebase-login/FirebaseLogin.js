import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, Input, Text} from '@rneui/themed';
import {Dumbbell} from 'lucide-react-native';
import logo from '../assets/logo.png';
import { Image } from '@rneui/base';

const FirebaseLogin = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('Inicio de sesión exitoso');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al iniciar sesión: ', error.message);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Input
            placeholder="Correo Electrónico"
            leftIcon={{type: 'material', name: 'email', color: '#ffffff'}}
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Contraseña"
            leftIcon={{type: 'material', name: 'lock', color: '#ffffff'}}
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Iniciar Sesión"
            buttonStyle={styles.loginButton}
            onPress={handleLogin}
            titleStyle={styles.buttonText}
          />

          <View style={styles.linkContainer}>
            <Button
              title="Crear Cuenta"
              type="clear"
              onPress={() => navigation.navigate('FirebaseCrearCuenta')}
              titleStyle={styles.linkText}
            />
            <Button
              title="Recuperar Contraseña"
              type="clear"
              onPress={() => navigation.navigate('FirebaseRecuperarCuenta')}
              titleStyle={styles.linkText}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 250, // Ajusta el tamaño según lo necesites
    height: 250,
    resizeMode: 'contain', // Escala la imagen manteniendo las proporciones
  },
  title: {
    color: '#ffffff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderBottomColor: '#ffffff',
  },
  inputText: {
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#045d5b',
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default FirebaseLogin;
