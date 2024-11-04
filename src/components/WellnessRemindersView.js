import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import notifee, {
  AndroidImportance,
  TriggerType,
  TimeUnit,
} from '@notifee/react-native';
import fondo from '../assets/fondo_tabs.png';

const reminderTypes = [
  {
    id: 'activeBreaks',
    title: 'Pausas Activas',
    description: 'Recordatorios para levantarte y moverte',
  },
  {
    id: 'breathing',
    title: 'Ejercicios de Respiración',
    description: 'Alertas para practicar respiración profunda',
  },
  {
    id: 'meditation',
    title: 'Meditación',
    description: 'Recordatorios para meditar y relajarte',
  },
];

const frequencyOptions = [
  {label: 'Cada hora', value: 60},
  {label: 'Cada 2 horas', value: 120},
  {label: 'Cada 4 horas', value: 240},
  {label: 'Cada 8 horas', value: 480},
  {label: 'Diariamente', value: 1440},
];

const WellnessRemindersView = () => {
  const [reminders, setReminders] = useState({});

  useEffect(() => {
    // Solicitar permisos de notificaciones en Android 13+
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission for notifications not granted');
        }
      }
    };

    // Crear el canal de notificación
    const createChannelNotifee = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notification channel created');
    };

    const initializeNotifications = async () => {
      await requestNotificationPermission(); // Llama a la función de permiso
      await createChannelNotifee(); // Crea el canal de notificación
      loadReminders(); // Cargar recordatorios o cualquier otra función adicional
    };

    initializeNotifications();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('wellnessReminders');
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      } else {
        const defaultReminders = reminderTypes.reduce((acc, type) => {
          acc[type.id] = {enabled: false, frequency: 60, specificTime: null};
          return acc;
        }, {});
        setReminders(defaultReminders);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async newReminders => {
    try {
      await AsyncStorage.setItem(
        'wellnessReminders',
        JSON.stringify(newReminders),
      );
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const toggleReminder = id => {
    if (reminders[id] === undefined) return;
    const newReminders = {
      ...reminders,
      [id]: {...reminders[id], enabled: !reminders[id].enabled},
    };
    setReminders(newReminders);
    saveReminders(newReminders);

    if (newReminders[id].enabled) {
      scheduleNotification(id);
    } else {
      cancelNotification(id);
    }
  };

  const scheduleNotification = async id => {
    const reminder = reminders[id];
    const title = `Recordatorio de ${getReminderTitle(id)}`;
    const message = `Es hora de tu ${getReminderTitle(id).toLowerCase()}`;

    console.log('frequency: ', reminder.frequency);

    // Disparador para la notificación programada
    const trigger = {
      type: TriggerType.INTERVAL,
      interval: reminder.frequency,
      timeUnit: TimeUnit.MINUTES,
    };

    // Crear la notificación programada
    await notifee.createTriggerNotification(
      {
        id: id,
        title: title,
        body: message,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      },
      trigger, // Usar el disparador configurado
    );

    console.log(
      `Notificación programada para ${id} para dentro de ${reminder.frequency} minutos`,
    );
  };

  const cancelNotification = async id => {
    await notifee.cancelNotification(id);
    console.log(`Notification with id ${id} canceled`);
  };

  const getReminderTitle = id => {
    return reminderTypes.find(type => type.id === id)?.title || '';
  };

  const handleFrequencyChange = (id, value) => {
    const newReminders = {
      ...reminders,
      [id]: {
        ...reminders[id],
        frequency: value,
      },
    };
    setReminders(newReminders);
    saveReminders(newReminders);
    if (newReminders[id].enabled) {
      cancelNotification(id);
      scheduleNotification(id);
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Recordatorios de Bienestar</Text>
          {reminderTypes.map(type => (
            <View key={type.id} style={styles.reminderItem}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{type.title}</Text>
                <Text style={styles.reminderDescription}>
                  {type.description}
                </Text>
                <Picker
                  selectedValue={reminders[type.id]?.frequency}
                  style={styles.picker}
                  onValueChange={itemValue =>
                    handleFrequencyChange(type.id, itemValue)
                  }>
                  {frequencyOptions.map(option => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 10,
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
