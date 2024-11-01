import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { FlatList, View } from 'react-native';
import { ListItem, Text } from '@rneui/themed';
import { ScrollView } from 'react-native';

const FirebaseLeer = () => {

    const [data, setData] = useState();
    const [rtdata, setRTData] = useState();
  
  
    async function loadData() {
        try {
          const inventario = await firestore().collection('Inventario').get();  
          setData(inventario.docs);
        } catch (error) {
            console.log(error)
        }
    }

    //leer datos en tiempo real
    async function loadTRData() {

      const suscriber = firestore().collection('Inventario').onSnapshot(querySnapshot => {

          const productos = [];

          querySnapshot.forEach(documentSnapshot => {
              productos.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id
              })
          })
          setRTData(productos)
          
      })

      return () => suscriber();
    }


  useEffect(() => {
    loadData();
    loadTRData();
  }, [])
  
  
  return (
    <ScrollView>
         <Text>Mi inventario</Text>
         <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.data().nombre}</ListItem.Title>
                    <ListItem.Subtitle>{item.data().cantidad} - {item.data().precio}</ListItem.Subtitle>
                </ListItem.Content>
                </ListItem>
        )}
        />

       <Text>Mi inventario en tiempo real</Text>
       <FlatList
            data={rtdata}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
                <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.nombre}</ListItem.Title>
                    <ListItem.Subtitle>{item.cantidad} - {item.precio}</ListItem.Subtitle>
                </ListItem.Content>
                </ListItem>
        )}
        />
   </ScrollView>
  )
}

export default FirebaseLeer