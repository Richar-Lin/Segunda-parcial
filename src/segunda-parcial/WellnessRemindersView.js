import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const reminderTypes = [
  { id: 'activeBreaks', title: 'Pausas Activas', description: 'Recordatorios para levantarte y moverte' },
  { id: 'breathing', title: 'Ejercicios de Respiración', description: 'Alertas para practicar respiración profunda' },
  { id: 'meditation', title: 'Meditación', description: 'Recordatorios para meditar y relajarte' },
];

const WellnessRemindersView = () => {
  const [reminders, setReminders] = useState({
    activeBreaks: false,
    breathing: false,
    meditation: false,
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('wellnessReminders');
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (newReminders) => {
    try {
      await AsyncStorage.setItem('wellnessReminders', JSON.stringify(newReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const toggleReminder = (id) => {
    const newReminders = { ...reminders, [id]: !reminders[id] };
    setReminders(newReminders);
    saveReminders(newReminders);
    
    if (newReminders[id]) {
      scheduleNotification(id);
    } else {
      cancelNotification(id);
    }
  };

  const scheduleNotification = (id) => {
    PushNotification.localNotificationSchedule({
      channelId: "wellness-reminders",
      title: `Recordatorio de ${getReminderTitle(id)}`,
      message: `Es hora de tu ${getReminderTitle(id).toLowerCase()}`,
      repeatType: 'time',
      repeatTime: 3600000, // Repeat every hour
    });
  };

  const cancelNotification = (id) => {
    PushNotification.cancelAll();
  };

  const getReminderTitle = (id) => {
    return reminderTypes.find(type => type.id === id)?.title || '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Recordatorios de Bienestar</Text>
        {reminderTypes.map((type) => (
          <View key={type.id} style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{type.title}</Text>
              <Text style={styles.reminderDescription}>{type.description}</Text>
            </View>
            <Switch
              value={reminders[type.id]}
              onValueChange={() => toggleReminder(type.id)}
              accessibilityLabel={`Activar recordatorios de ${type.title}`}
            />
          </View>
        ))}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => console.log('Configuración guardada')}
        >
          <Text style={styles.saveButtonText}>Guardar Configuración</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 10,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WellnessRemindersView;