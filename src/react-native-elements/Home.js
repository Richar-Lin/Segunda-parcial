import { ListItem } from '@rneui/base'
import React from 'react'
import { ScrollView} from 'react-native'

const Home = ({navigation}) => {

  return (
    <ScrollView>     
      <ListItem bottomDivider onPress={() => navigation.navigate('WellnessRemindersView')}>
        <ListItem.Content >
          <ListItem.Title>Recordatorio</ListItem.Title>
        </ListItem.Content>
      </ListItem>   
      <ListItem bottomDivider onPress={() => navigation.navigate('DailyTipsView')}>
        <ListItem.Content >
          <ListItem.Title>Consejos Diarios</ListItem.Title>
        </ListItem.Content>
      </ListItem>   
      <ListItem bottomDivider onPress={() => navigation.navigate('DailyProgressView')}>
        <ListItem.Content >
          <ListItem.Title>Progreso Diario</ListItem.Title>
        </ListItem.Content>
      </ListItem>             
      <ListItem bottomDivider onPress={() => navigation.navigate('WeeklyProgressView')}>
        <ListItem.Content >
          <ListItem.Title>Estadistica Semanal y Mensual</ListItem.Title>
        </ListItem.Content>
      </ListItem>                                       
    </ScrollView>
  )
}

export default Home