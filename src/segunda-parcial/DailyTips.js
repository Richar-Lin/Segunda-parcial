import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const DailyTipsView = () => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTips = async () => {
      const user = auth().currentUser;
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const tipsSnapshot = await firestore()
          .collection('dailyTips')
          .where('date', '==', today)
          .where('userId', '==', user.uid)
          .get();

        if (tipsSnapshot.empty) {
          // If no tips for today, create new ones
          const newTips = generateDailyTips();
          const batch = firestore().batch();
          newTips.forEach((tip) => {
            const tipRef = firestore().collection('dailyTips').doc();
            batch.set(tipRef, { ...tip, userId: user.uid, date: today });
          });
          await batch.commit();
          setTips(newTips);
        } else {
          setTips(tipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
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

  const toggleTipCompletion = async (tipId) => {
    const updatedTips = tips.map(tip => 
      tip.id === tipId ? { ...tip, completed: !tip.completed } : tip
    );
    setTips(updatedTips);

    // Update in Firestore
    await firestore().collection('dailyTips').doc(tipId).update({
      completed: !tips.find(tip => tip.id === tipId).completed
    });
  };

  const renderTip = ({ item }) => (
    <TouchableOpacity 
      style={styles.tipItem} 
      onPress={() => toggleTipCompletion(item.id)}
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Consejos Diarios</Text>
      <FlatList
        data={tips}
        renderItem={renderTip}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
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