import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import auth from '@react-native-firebase/auth';
import { Dumbbell } from 'lucide-react-native';

const FirebaseCrearCuenta = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      console.error("Las contraseñas no coinciden");
      return;
    }
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('Cuenta creada exitosamente');
      navigation.navigate('FirebaseLogin');
    } catch (error) {
      console.error("Error al crear cuenta: ", error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80' }}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <Dumbbell size={50} color="#ffffff" />
              <Text h2 style={styles.title}>Crear Cuenta</Text>
            </View>
            
            <Input
              placeholder="Correo Electrónico"
              leftIcon={{ type: 'material', name: 'email', color: '#ffffff' }}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <Input
              placeholder="Contraseña"
              leftIcon={{ type: 'material', name: 'lock', color: '#ffffff' }}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              placeholder="Confirmar Contraseña"
              leftIcon={{ type: 'material', name: 'lock', color: '#ffffff' }}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Button 
              title="Registrar" 
              buttonStyle={styles.registerButton} 
              onPress={handleSignUp}
              titleStyle={styles.buttonText}
            />

            <Button 
              title="¿Ya tienes una cuenta? Inicia sesión" 
              type="clear" 
              onPress={() => navigation.navigate('FirebaseLogin')}
              titleStyle={styles.linkText}
            />
          </View>
        </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 20,
  },
});

export default FirebaseCrearCuenta;