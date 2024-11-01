import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DailyTipsView = () => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTips = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedTips = await AsyncStorage.getItem(`dailyTips_${today}`);
      const lastStoredDate = await AsyncStorage.getItem('lastTipsDate');

      // Si no hay consejos almacenados o la fecha almacenada es diferente a hoy
      if (!storedTips || lastStoredDate !== today) {
        const newTips = generateDailyTips();
        setTips(newTips);
        await AsyncStorage.setItem(`dailyTips_${today}`, JSON.stringify(newTips));
        await AsyncStorage.setItem('lastTipsDate', today); // Actualiza la fecha de los consejos
      } else {
        setTips(JSON.parse(storedTips));
      }
    };

    fetchTips();
  }, []);

  const generateDailyTips = () => {
    const allTips = [
      { text: 'Comer al menos 2 piezas de fruta hoy', completed: false },
      { text: 'Meditar durante 10 minutos', completed: false },
      { text: 'Beber 8 vasos de agua', completed: false },
      { text: 'Hacer 15 minutos de estiramientos', completed: false },
      { text: 'Tomar un descanso de 5 minutos cada hora de trabajo', completed: false },
      { text: 'Llamar a un amigo o familiar', completed: false },
      { text: 'Leer 10 páginas de un libro', completed: false },
      { text: 'Dar un paseo de 15 minutos al aire libre', completed: false },
      { text: 'Practicar gratitud escribiendo 3 cosas positivas del día', completed: false },
      { text: 'Evitar el uso de dispositivos electrónicos 1 hora antes de dormir', completed: false },
    ];
    return allTips.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  const toggleTipCompletion = async (index) => {
    const updatedTips = tips.map((tip, i) =>
      i === index ? { ...tip, completed: !tip.completed } : tip
    );
    setTips(updatedTips);
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`dailyTips_${today}`, JSON.stringify(updatedTips));
  };

  const renderTip = ({ item, index }) => (
    <TouchableOpacity
      style={styles.tipItem}
      onPress={() => toggleTipCompletion(index)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.completed }}
    >
      <Icon
        name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
        size={24}
        color={item.completed ? '#4CAF50' : '#757575'}
      />
      <Text style={[styles.tipText, item.completed && styles.completedTipText]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consejos Diarios</Text>
      <FlatList
        data={tips}
        renderItem={renderTip}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  completedTipText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
});

export default DailyTipsView;
