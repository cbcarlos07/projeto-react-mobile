import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import  Constants  from 'expo-constants'
import MapView, { Marker } from 'react-native-maps'
import { Feather as Icon } from '@expo/vector-icons'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'
import axios from 'axios'


  interface Item {
    id: number
    title: string
    image_url: string
  }

  interface Points {
    id: number
    name: string
    image: string
    image_url: string
    latitude: number
    longitude: number
    

  }

  interface Params {
    uf: string
    city: string
  }

  interface IBGEUfResponse {
    sigla: string
  }

  interface IBGECityResponse{
    city: string
  }


const Points = () => {
  const routes = useRoute()
  const routeParam = routes.params as Params

	const navigation = useNavigation()
	const [ selectedItems, setSelectedItem] = useState<number[]>([])
	const [ items, setItems ] = useState<Item[]>([])
	const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0])
  const [ points, setPoints ] = useState<Points[]>([])
  
  const [ ufs, setUfs] = useState<string[]>([])

  useEffect(()=>{
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
         .then( response =>{
           const ufInitials = response.data.map( uf => uf.sigla )
           setUfs( ufInitials )
         })
  },[])

	useEffect(()=>{
		api.get('points', {
			params: {
				city: routeParam.city,
				uf: routeParam.uf,
				items: selectedItems
			}
		}).then( response =>{
			setPoints( response.data )
		})
	}, [selectedItems])
	useEffect(()=>{
		async function loadPosition(){
			const { status } = await Location.requestPermissionsAsync()

			if( status !== 'granted' ){
				Alert.alert('Oops','Precisamos de sua permissão para obtermos sua localização')
				return
			}

			const location = await Location.getCurrentPositionAsync()

			const { latitude, longitude} = location.coords
			console.log(latitude, longitude);
			
			setInitialPosition([latitude, longitude])
		}
		loadPosition()
	},[])

    useEffect(()=>{
        api.get( 'items' ).then(response =>{ 
            setItems( response.data )
         })
    },[])

    function handleNaviteBack(){
        navigation.goBack()
	}
	
	function handleNavigateToDetail(id: number){
		navigation.navigate('Detail', {point_id: id})
	}

	function handleSelectedItem	(id: number){
		const alreadSelected = selectedItems.findIndex(item => item === id)
		if( alreadSelected >= 0 ){
			const filteredItems = selectedItems.filter(item => item !== id)

			setSelectedItem( filteredItems )
		}else{
			setSelectedItem([...selectedItems, id] )
		}
	}

    return (
      <>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNaviteBack}>
                <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>

            <Text style={styles.title}>Bem vindo.</Text>
            <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

            <View style={styles.mapContainer}>
				{initialPosition[0] != 0 && (
					<MapView 
					loadingEnabled={initialPosition[0] == 0}
					style={styles.map} 
					initialRegion={{
						latitude: initialPosition[0],
						longitude: initialPosition[1],
						latitudeDelta: 0.014,
						longitudeDelta: 0.014
					}}>
						{points.map(point => (
							<Marker 
							key={String(point.id)}
							onPress={() => handleNavigateToDetail(point.id)}
							style={styles.mapMarker}
							coordinate={{
							latitude: point.latitude,
							longitude: point.longitude,
						}}>
							<View style={styles.mapMarkerContainer}>
								<Image style={styles.mapMarkerImage} source={{
									uri: point.image_url
								}}></Image>
								<Text style={styles.mapMarkerTitle}>{point.name}</Text>
							</View>
						</Marker>
						))}
					</MapView>
				)}
            </View>
        </View>

        <View style={styles.itemsContainer}>
			<ScrollView 
				horizontal 
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
				paddingHorizontal: 20
				}}
			>
				{items.map(item => (
					<TouchableOpacity 
						key={String( item.id )} 
						style={[
							styles.item,
							selectedItems.includes( item.id ) ? styles.selectedItem : {}
						]}
						activeOpacity={0.6}
						onPress={() => handleSelectedItem( item.id )}
					>
						<SvgUri width={42} height={42} uri={item.image_url} />
						<Text style={styles.itemTitle}>{item.title}</Text>
					</TouchableOpacity>     
				))}
            </ScrollView>
        </View>
      </>  
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points