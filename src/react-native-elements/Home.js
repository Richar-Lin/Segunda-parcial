import {ListItem, Icon} from '@rneui/base';
import React from 'react';
import {ScrollView, View, ImageBackground, StyleSheet} from 'react-native';
import background from '../assets/fondo_app.png';

const Home = ({navigation}) => {
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.listContainer}>
          <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('WellnessRemindersView')}>
            <ListItem.Content>
              <View style={styles.listItemContent}>
                <Icon name="notifications" color="#FFFFFF" size={24} />
                <ListItem.Title style={styles.listItemTitle}>
                  Recordatorio
                </ListItem.Title>
              </View>
            </ListItem.Content>
          </ListItem>
          <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('DailyTipsView')}>
            <ListItem.Content>
              <View style={styles.listItemContent}>
                <Icon name="lightbulb" color="#FFFFFF" size={24} />
                <ListItem.Title style={styles.listItemTitle}>
                  Consejos Diarios
                </ListItem.Title>
              </View>
            </ListItem.Content>
          </ListItem>
          <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('DailyProgressView')}>
            <ListItem.Content>
              <View style={styles.listItemContent}>
                <Icon name="bar-chart" color="#FFFFFF" size={24} />
                <ListItem.Title style={styles.listItemTitle}>
                  Progreso Diario
                </ListItem.Title>
              </View>
            </ListItem.Content>
          </ListItem>
          <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('WeeklyProgressView')}>
            <ListItem.Content>
              <View style={styles.listItemContent}>
                <Icon name="event" color="#FFFFFF" size={24} />
                <ListItem.Title style={styles.listItemTitle}>
                  Estadística Semanal y Mensual
                </ListItem.Title>
              </View>
            </ListItem.Content>
          </ListItem>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    flexGrow: 1,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    backgroundColor: 'transparent',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center', // Centra verticalmente el icono y el texto
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10, // Añade espacio entre el icono y el texto
  },
});

export default Home;
