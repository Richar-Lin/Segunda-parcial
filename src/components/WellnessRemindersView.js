import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { Picker } from '@react-native-picker/picker';

// Initialize PushNotification
PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
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
    channelDescription: "A channel to categorize your wellness notifications",
    playSound: true,
    soundName: "default",
    importance: PushNotification.Importance.HIGH,
    vibrate: true,
  },
  (created) => {
    console.log(`createChannel returned '${created}'`);
    if (!created) {
      console.error('Failed to create the channel.');
    }
  }
);

const reminderTypes = [
  { id: 'activeBreaks', title: 'Pausas Activas', description: 'Recordatorios para levantarte y moverte' },
  { id: 'breathing', title: 'Ejercicios de Respiración', description: 'Alertas para practicar respiración profunda' },
  { id: 'meditation', title: 'Meditación', description: 'Recordatorios para meditar y relajarte' },
];

const frequencyOptions = [
  { label: 'Cada hora', value: 60 },
  { label: 'Cada 2 horas', value: 120 },
  { label: 'Cada 4 horas', value: 240 },
  { label: 'Cada 8 horas', value: 480 },
  { label: 'Diariamente', value: 1440 },
];

const WellnessRemindersView = () => {
  const [reminders, setReminders] = useState({});
  
  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('wellnessReminders');
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      } else {
        const defaultReminders = reminderTypes.reduce((acc, type) => {
          acc[type.id] = { enabled: false, frequency: 60, specificTime: null }; // Default frequency to 1 hour
          return acc;
        }, {});
        setReminders(defaultReminders);
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
    if (reminders[id] === undefined) return;
    const newReminders = {
      ...reminders,
      [id]: { ...reminders[id], enabled: !reminders[id].enabled }
    };
    setReminders(newReminders);
    saveReminders(newReminders);

    if (newReminders[id].enabled) {
      scheduleNotification(id);
    } else {
      cancelNotification(id);
    }
  };

  const scheduleNotification = (id) => {
    const reminder = reminders[id];
    const title = `Recordatorio de ${getReminderTitle(id)}`;
    const message = `Es hora de tu ${getReminderTitle(id).toLowerCase()}`;

    const date = new Date(Date.now() + reminder.frequency * 60 * 1000);

    PushNotification.localNotificationSchedule({
      channelId: "wellness-reminders",
      id: id,
      title,
      message,
      date,
      allowWhileIdle: true,
      repeatType: 'time',
      repeatTime: reminder.frequency * 60 * 1000,
    });

    console.log(`Notification scheduled for ${id} at ${date.toLocaleString()}`);
  };

  const cancelNotification = (id) => {
    PushNotification.cancelLocalNotification(id);
    console.log(`Notification cancelled for ${id}`);
  };

  const getReminderTitle = (id) => {
    return reminderTypes.find(type => type.id === id)?.title || '';
  };

  const handleFrequencyChange = (id, value) => {
    const newReminders = {
      ...reminders,
      [id]: {
        ...reminders[id],
        frequency: value,
      }
    };
    setReminders(newReminders);
    saveReminders(newReminders);
    if (newReminders[id].enabled) {
      cancelNotification(id);
      scheduleNotification(id);
    }
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
              <Picker
                selectedValue={reminders[type.id]?.frequency}
                style={styles.picker}
                onValueChange={(itemValue) => handleFrequencyChange(type.id, itemValue)}
              >
                {frequencyOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
            <Switch
              value={Boolean(reminders[type.id]?.enabled)}
              onValueChange={() => toggleReminder(type.id)}
              accessibilityLabel={`Activar recordatorios de ${type.title}`}
            />
          </View>
        ))}
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
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 10, // Adding some space between picker and switch
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDescription: {
    color: '#666',
  },
  picker: {
    width: '100%',
  },
});

export default WellnessRemindersView;
