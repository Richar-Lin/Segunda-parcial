import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    importance: PushNotification.Importance.HIGH, // Ensure correct importance
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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [frequency, setFrequency] = useState(60);
  const [specificTime, setSpecificTime] = useState(new Date());
  const [useSpecificTime, setUseSpecificTime] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
          acc[type.id] = { enabled: false, frequency: 60, specificTime: null };
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

    let date;
    if (reminder.specificTime) {
      date = new Date(reminder.specificTime);
      // If the time has already passed today, schedule for tomorrow
      if (date < new Date()) {
        date.setDate(date.getDate() + 1);
      }
    } else {
      date = new Date(Date.now() + reminder.frequency * 60 * 1000);
    }

    PushNotification.localNotificationSchedule({
      channelId: "wellness-reminders",
      id: id,
      title,
      message,
      date,
      allowWhileIdle: true,
      repeatType: reminder.specificTime ? 'day' : 'time',
      repeatTime: reminder.specificTime ? 24 * 60 * 60 * 1000 : reminder.frequency * 60 * 1000,
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

  const openModal = (id) => {
    setCurrentReminder(id);
    setFrequency(reminders[id].frequency);
    setUseSpecificTime(!!reminders[id].specificTime);
    if (reminders[id].specificTime) {
      setSpecificTime(new Date(reminders[id].specificTime));
    } else {
      setSpecificTime(new Date());
    }
    setModalVisible(true);
  };

  const saveReminderSettings = () => {
    const newReminders = {
      ...reminders,
      [currentReminder]: {
        ...reminders[currentReminder],
        frequency,
        specificTime: useSpecificTime ? specificTime.toISOString() : null
      }
    };
    setReminders(newReminders);
    saveReminders(newReminders);
    if (newReminders[currentReminder].enabled) {
      cancelNotification(currentReminder);
      scheduleNotification(currentReminder);
    }
    closeModal();
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSpecificTime(selectedDate);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setUseSpecificTime(false);
    setShowTimePicker(false);
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
              <TouchableOpacity onPress={() => openModal(type.id)}>
                <Text style={styles.customizeText}>Personalizar</Text>
              </TouchableOpacity>
            </View>
            <Switch
              value={Boolean(reminders[type.id]?.enabled)}
              onValueChange={() => toggleReminder(type.id)}
              accessibilityLabel={`Activar recordatorios de ${type.title}`}
            />
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Configurar Recordatorio</Text>
            
            <View style={styles.pickerContainer}>
              <Text>Frecuencia:</Text>
              <Picker
                selectedValue={frequency}
                style={styles.picker}
                onValueChange={(itemValue) => setFrequency(itemValue)}
              >
                {frequencyOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>

            <View style={styles.switchContainer}>
              <Text>Usar hora específica:</Text>
              <Switch
                value={useSpecificTime}
                onValueChange={(value) => {
                  setUseSpecificTime(value);
                  if (value && Platform.OS === 'android') {
                    setShowTimePicker(true);
                  }
                }}
              />
            </View>

            {useSpecificTime && (Platform.OS === 'ios' || showTimePicker) && (
              <DateTimePicker
                value={specificTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {useSpecificTime && Platform.OS === 'android' && (
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text>{specificTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveReminderSettings}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDescription: {
    color: '#666',
  },
  customizeText: {
    color: '#007BFF',
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WellnessRemindersView;