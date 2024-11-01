import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Input, ListItem, Text } from '@rneui/themed';

const FirebaseGuardar = () => {

    const [rtdata, setRTData] = useState();
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
  
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
    loadTRData();
  }, [])
  

  const subirInventario = () => {

        try {
            firestore().collection('Inventario').add({
                nombre: nombre,
                cantidad: cantidad,
                precio: precio
            })
        } catch (error) {
            console.log(error);
        } finally {
            setNombre('');
            setCantidad('');
            setPrecio('');
        }
  };
  
  return (
    <ScrollView>
        <View>
            <Input
                placeholder='Nombre'
                value= { nombre }
                onChangeText={ text => setNombre(text)}
                style = {styles.input}
            ></Input>

            <Input
                placeholder='Cantidad'
                value= { cantidad }
                onChangeText={ text => setCantidad(text)}
                style = {styles.input}
            ></Input>

            <Input
                placeholder='Precio'
                value= { precio }
                onChangeText={ text => setPrecio(text)}
                style = {styles.input}
            ></Input>

            <Button
                    title='Subir inventario'
                    onPress={()=> subirInventario()}
            ></Button>
        </View>

       <Text style = {styles.text}>Mi inventario en tiempo real</Text>
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

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
    },
    text: {
        marginBottom: 10,
        marginBottom: 10,
        color: 'blue', 
        textAlign: 'center', 
        fontSize: 22
    }
})

export default FirebaseGuardar