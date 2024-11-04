import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import fondo from '../assets/fondo_tabs.png';

const WeeklyProgressView = ({navigation}) => {
  const [progressList, setProgressList] = useState([]);
  const [viewMode, setViewMode] = useState('weekly'); // Alterna entre 'weekly' y 'monthly'
  const [firstUseDate, setFirstUseDate] = useState(null);

  useEffect(() => {
    fetchFirstUseDate();
  }, []);

  useEffect(() => {
    if (firstUseDate) fetchAggregatedProgressData();
  }, [viewMode, firstUseDate]);

  const fetchFirstUseDate = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      const snapshot = await firestore()
        .collection('dailyProgress')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'asc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const firstEntry = snapshot.docs[0].data();
        setFirstUseDate(firstEntry.timestamp.toDate());
      }
    } catch (error) {
      console.error('Error fetching first use date:', error);
      Alert.alert(
        'Error',
        'No se pudo cargar la fecha de inicio de uso. Por favor, intenta de nuevo.',
      );
    }
  };

  const fetchAggregatedProgressData = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 30);

      const snapshot = await firestore()
        .collection('dailyProgress')
        .where('userId', '==', user.uid)
        .where('timestamp', '>=', pastDate)
        .orderBy('timestamp', 'desc')
        .get();

      const data = snapshot.docs.map(doc => doc.data());

      const aggregatedData =
        viewMode === 'weekly' ? groupByWeek(data) : groupByMonth(data);
      setProgressList(aggregatedData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      Alert.alert(
        'Error',
        'No se pudo cargar el progreso. Por favor, intenta de nuevo.',
      );
    }
  };

  const groupByWeek = data => {
    const groupedData = {};
    data.forEach(entry => {
      const date = new Date(entry.timestamp.toDate());
      const weekNumber = getWeekSinceFirstUse(date);

      if (!groupedData[weekNumber]) {
        groupedData[weekNumber] = {
          sleepHours: 0,
          exerciseHours: 0,
          calories: 0,
          entries: 0,
        };
      }

      groupedData[weekNumber].sleepHours += entry.sleepHours;
      groupedData[weekNumber].exerciseHours += entry.exerciseHours;
      groupedData[weekNumber].calories += entry.calories;
      groupedData[weekNumber].entries += 1;
    });

    return Object.keys(groupedData).map(week => ({
      week,
      ...groupedData[week],
      sleepHours: (
        groupedData[week].sleepHours / groupedData[week].entries
      ).toFixed(1),
      exerciseHours: (
        groupedData[week].exerciseHours / groupedData[week].entries
      ).toFixed(1),
      calories: (
        groupedData[week].calories / groupedData[week].entries
      ).toFixed(0),
    }));
  };

  const groupByMonth = data => {
    const groupedData = {};
    data.forEach(entry => {
      const date = new Date(entry.timestamp.toDate());
      const month = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!groupedData[month]) {
        groupedData[month] = {
          sleepHours: 0,
          exerciseHours: 0,
          calories: 0,
          entries: 0,
        };
      }

      groupedData[month].sleepHours += entry.sleepHours;
      groupedData[month].exerciseHours += entry.exerciseHours;
      groupedData[month].calories += entry.calories;
      groupedData[month].entries += 1;
    });

    return Object.keys(groupedData).map(month => ({
      month,
      ...groupedData[month],
      sleepHours: (
        groupedData[month].sleepHours / groupedData[month].entries
      ).toFixed(1),
      exerciseHours: (
        groupedData[month].exerciseHours / groupedData[month].entries
      ).toFixed(1),
      calories: (
        groupedData[month].calories / groupedData[month].entries
      ).toFixed(0),
    }));
  };

  const getWeekSinceFirstUse = date => {
    const diffInMs = date - firstUseDate;
    return Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  };

  return (
    <ImageBackground source={fondo} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Progreso {viewMode === 'weekly' ? 'Semanal' : 'Mensual'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'weekly' && styles.activeButton,
            ]}
            onPress={() => setViewMode('weekly')}>
            <Text style={styles.buttonText}>Semanal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'monthly' && styles.activeButton,
            ]}
            onPress={() => setViewMode('monthly')}>
            <Text style={styles.buttonText}>Mensual</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={progressList}
          keyExtractor={item =>
            viewMode === 'weekly' ? `week-${item.week}` : `month-${item.month}`
          }
          renderItem={({item}) => (
            <View style={styles.progressItem}>
              <Text style={styles.progressText}>
                {viewMode === 'weekly'
                  ? `Semana ${item.week} de uso`
                  : `Mes ${item.month}`}
              </Text>
              <Text style={styles.progressText}>
                Sueño Promedio: {item.sleepHours} hrs
              </Text>
              <Text style={styles.progressText}>
                Ejercicio Promedio: {item.exerciseHours} hrs
              </Text>
              <Text style={styles.progressText}>
                Calorías Promedio: {item.calories}
              </Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  viewButton: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#021e37',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#045d5b',
  },
  buttonText: {
    color: 'white',
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
    fontSize: 17,
  },
});

export default WeeklyProgressView;
