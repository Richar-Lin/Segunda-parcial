import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Text } from "@rneui/themed";
import auth from '@react-native-firebase/auth';
import { KeyRound } from 'lucide-react-native';

const FirebaseRecuperarCuenta = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Correo de recuperación enviado');
      navigation.navigate('FirebaseLogin');
    } catch (error) {
      console.error("Error al enviar correo de recuperación: ", error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80' }}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <KeyRound size={50} color="#ffffff" />
              <Text h2 style={styles.title}>Recuperar Contraseña</Text>
            </View>
            
            <Text style={styles.description}>
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </Text>
            
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

            <Button 
              title="Enviar Correo de Recuperación" 
              buttonStyle={styles.recoverButton} 
              onPress={handleResetPassword}
              titleStyle={styles.buttonText}
            />

            <Button 
              title="Volver al Inicio de Sesión" 
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
    textAlign: 'center',
  },
  description: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  inputContainer: {
    borderBottomColor: '#ffffff',
  },
  inputText: {
    color: '#ffffff',
  },
  recoverButton: {
    backgroundColor: '#FF6B6B',
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

export default FirebaseRecuperarCuenta;