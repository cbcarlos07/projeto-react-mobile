import React, {useState, useEffect, lazy} from 'react'
import { Feather as Icon} from '@expo/vector-icons'
import { Text, ImageBackground, Image, StyleSheet, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'
interface IBGEUfResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

interface objSelecte{
  label: string
  value: string
}


const Home = () =>{
    const [selectedUf, setSelectedUf] = useState('0')
    const [ selectedCity, setSelectedCity ] = useState('0')
    const [city, setCity] = useState('')
    const navigation = useNavigation()
    const [ufs, setUfs] = useState<objSelecte[]>([])
    const [ cityes, setCities ] = useState<objSelecte[]>([])

    useEffect(()=>{
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
             .then( response => {
                const initialsUf = response.data.map( uf => ({label: uf.sigla, value: uf.sigla}))
                setUfs( initialsUf )
             })
    }, [])

    useEffect(()=>{
      if( selectedUf == null ) return
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
           .then( response => {
              const initialsCity = response.data.map( city => ({label: city.nome, value: city.nome}) )
              setCities( initialsCity )
           } )

    })
    
    function handleNavigateToPoints(){
      navigation.navigate( 'Points', {
        uf: selectedUf,
        city: selectedCity
      } )
    }

    function handleUfSelected(value: string){
      setSelectedUf( value )
    }

    function handleCitySelected( value: string ){
      setSelectedCity( value )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : undefined }>

          <ImageBackground 
              source={ require( '../../assets/home-background.png' ) } 
              style={styles.container}
              imageStyle={{ width: 274, height: 368 }}
            >
              <View style={styles.main}>
                  <Image source={ require( '../../assets/logo.png' ) } />
                  <View>
                    <Text style={styles.title}>Seu market place de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</Text>
                  </View>
              </View>

              <View style={styles.footer}>

                  <RNPickerSelect 
                    onValueChange={ value => handleUfSelected( value )}
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'Selecione um estado',
                      value: null,
                      color: 'red',
                    }}
                    items={ufs}
                  />

                  <RNPickerSelect
                    onValueChange={ value => handleCitySelected( value ) }
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'Selecione uma cidade',
                      value: null,
                      color: 'red'
                    }}
                    items={cityes}
                  />

                  <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                      <View style={styles.buttonIcon}>
                          <Text>
                              <Icon name="arrow-right" color="#FFF" size={24} />
                          </Text>
                      </View>
                      <Text style={styles.buttonText}>
                          Entrar
                      </Text>
                  </RectButton>
              </View>
          </ImageBackground>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
    
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home