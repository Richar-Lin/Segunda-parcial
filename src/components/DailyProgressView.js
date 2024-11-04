import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import fondo from '../assets/fondo_tabs.png';

const DailyProgressView = ({navigation}) => {
  const [sleepHours, setSleepHours] = useState('');
  const [exerciseHours, setExerciseHours] = useState('');
  const [calories, setCalories] = useState('');
  const [progressList, setProgressList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      const snapshot = await firestore()
        .collection('dailyProgress')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .get();

      const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setProgressList(data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

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
      if (editingId) {
        // Update the existing document
        await firestore()
          .collection('dailyProgress')
          .doc(editingId)
          .update({
            sleepHours: parseFloat(sleepHours),
            exerciseHours: parseFloat(exerciseHours),
            calories: parseInt(calories),
          });
        Alert.alert('Éxito', 'El progreso ha sido actualizado');
      } else {
        // Add a new document
        await firestore()
          .collection('dailyProgress')
          .add({
            userId: user.uid,
            date: new Date().toISOString().split('T')[0],
            sleepHours: parseFloat(sleepHours),
            exerciseHours: parseFloat(exerciseHours),
            calories: parseInt(calories),
            timestamp: firestore.FieldValue.serverTimestamp(),
          });
        Alert.alert('Éxito', 'Tu progreso diario ha sido guardado');
      }

      setSleepHours('');
      setExerciseHours('');
      setCalories('');
      setEditingId(null);
      fetchProgressData();
    } catch (error) {
      console.error('Error al guardar el progreso:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar el progreso. Por favor, intenta de nuevo.',
      );
    }
  };

  const handleEdit = item => {
    setSleepHours(item.sleepHours.toString());
    setExerciseHours(item.exerciseHours.toString());
    setCalories(item.calories.toString());
    setEditingId(item.id);
  };

  const handleDelete = async id => {
    try {
      await firestore().collection('dailyProgress').doc(id).delete();
      Alert.alert('Éxito', 'El progreso ha sido eliminado');
      fetchProgressData();
    } catch (error) {
      console.error('Error al eliminar el progreso:', error);
      Alert.alert(
        'Error',
        'No se pudo eliminar el progreso. Por favor, intenta de nuevo.',
      );
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.backgroundImage}>
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
          <Text style={styles.saveButtonText}>
            {editingId ? 'Editar Progreso' : 'Guardar Progreso'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={progressList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.progressItem}>
              <Text style={styles.progressText}>Fecha: {item.date}</Text>
              <Text style={styles.progressText}>
                Sueño: {item.sleepHours} hrs
              </Text>
              <Text style={styles.progressText}>
                Ejercicio: {item.exerciseHours} hrs
              </Text>
              <Text style={styles.progressText}>Calorías: {item.calories}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  saveButton: {
    backgroundColor: '#045d5b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  progressText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FABF07',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DailyProgressView;
