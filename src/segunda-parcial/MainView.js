import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SectionButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.sectionButton} onPress={onPress}>
    <Icon name={icon} size={24} color="#007AFF" />
    <Text style={styles.sectionButtonText}>{title}</Text>
  </TouchableOpacity>
);

const StatItem = ({ icon, title, value, target }) => {
  const progress = Math.min((value / target) * 100, 100);
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={24} color="#007AFF" />
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.statValue}>{value} / {target}</Text>
      </View>
    </View>
  );
};

const MainView = ({ navigation }) => {
  const [dailyStats, setDailyStats] = useState({
    steps: 0,
    calories: 0,
    water: 0,
    sleep: 0
  });

  useEffect(() => {
    const fetchDailyStats = async () => {
      const user = auth().currentUser;
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const statsDoc = await firestore()
          .collection('dailyStats')
          .doc(`${user.uid}_${today}`)
          .get();

        if (statsDoc.exists) {
          setDailyStats(statsDoc.data());
        }
      }
    };

    fetchDailyStats();
    // Idealmente, deberías configurar un listener en tiempo real aquí
    // para actualizar las estadísticas cuando cambien en Firestore
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>Bienvenido a tu aplicación de fitness</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estadísticas Diarias</Text>
          <StatItem icon="directions-walk" title="Pasos" value={dailyStats.steps} target={10000} />
          <StatItem icon="local-fire-department" title="Calorías" value={dailyStats.calories} target={2000} />
          <StatItem icon="opacity" title="Agua (ml)" value={dailyStats.water} target={2000} />
          <StatItem icon="bedtime" title="Sueño (horas)" value={dailyStats.sleep} target={8} />
        </View>
        
        <View style={styles.sectionsContainer}>
          <SectionButton 
            title="Entrenamiento" 
            icon="fitness-center" 
            onPress={() => navigation.navigate('Entrenamiento')} 
          />
          <SectionButton 
            title="Consejos Diarios" 
            icon="lightbulb" 
            onPress={() => navigation.navigate('DailyTips')} 
          />
          <SectionButton 
            title="Nutrición" 
            icon="restaurant" 
            onPress={() => navigation.navigate('Nutricion')} 
          />
          <SectionButton 
            title="Progreso Diario" 
            icon="today" 
            onPress={() => navigation.navigate('DailyProgress')} 
          />
          <SectionButton 
            title="Recordatorios" 
            icon="notifications" 
            onPress={() => navigation.navigate('WellnessReminders')} 
          />
          <SectionButton 
            title="Configuración" 
            icon="settings" 
            onPress={() => navigation.navigate('Configuracion')} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statInfo: {
    flex: 1,
    marginLeft: 10,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  statValue: {
    fontSize: 12,
    color: '#666',
  },
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionButton: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default MainView;