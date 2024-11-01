import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const DailyProgressView = ({ navigation }) => {
  const [sleepHours, setSleepHours] = useState('');
  const [exerciseHours, setExerciseHours] = useState('');
  const [calories, setCalories] = useState('');

  const handleSave = async () => {
    if (!sleepHours || !exerciseHours || !calories) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    try {
      await firestore().collection('dailyProgress').add({
        userId: user.uid,
        date: new Date().toISOString().split('T')[0],
        sleepHours: parseFloat(sleepHours),
        exerciseHours: parseFloat(exerciseHours),
        calories: parseInt(calories),
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Éxito', 'Tu progreso diario ha sido guardado');
      setSleepHours('');
      setExerciseHours('');
      setCalories('');
    } catch (error) {
      console.error('Error al guardar el progreso:', error);
      Alert.alert('Error', 'No se pudo guardar el progreso. Por favor, intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Progreso Diario</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horas de sueño:</Text>
        <TextInput
          style={styles.input}
          value={sleepHours}
          onChangeText={setSleepHours}
          placeholder="Ej: 8"
          keyboardType="numeric"
          accessibilityLabel="Ingresa las horas de sueño"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horas de ejercicio:</Text>
        <TextInput
          style={styles.input}
          value={exerciseHours}
          onChangeText={setExerciseHours}
          placeholder="Ej: 1.5"
          keyboardType="numeric"
          accessibilityLabel="Ingresa las horas de ejercicio"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Calorías consumidas:</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          placeholder="Ej: 2000"
          keyboardType="numeric"
          accessibilityLabel="Ingresa las calorías consumidas"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Progreso</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DailyProgressView;