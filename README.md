    npm i -g expo-cli
    expo init nome_do_projeto

# Mudar a rede do Expo

    set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.59
    set is only used for one session. If you always wanna use the same ip after reboot you can use:

    setx /M REACT_NATIVE_PACKAGER_HOSTNAME 192.168.1.59

# Instalar fonts do expo

    expo install @expo-google-fonts/roboto @expo-google-fonts/ubuntu expo-font

# Navegação


https://reactnavigation.org/docs/getting-started

    npm install @react-navigation/native

    expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

    npm i @react-navigation/stack


# Mapas

    expo install react-native-maps


expo install expo-constants

# Ler imagens svg

    expo install react-native-svg


# Localização do usuário

    expo install expo-location

https://www.youtube.com/watch?time_continue=284&v=xYeaHqpTo3Y&feature=emb_title


1:48


http://localhost:3333/points

Inserir ponto de coleta

    {
        "name": "Mercado ",
        "email": "contato@imperatiz.com.br",
        "whatsapp": "92995555555",
        "latitude" : -45685656,
        "longitude": -25353542,
        "city": "Manaus",
        "uf": "AM",
        "items": [6]
    }

# Mail

    https://docs.expo.io/versions/latest/sdk/mail-composer/

# Select option

    https://www.npmjs.com/package/react-native-picker-select

    https://snack.expo.io/@liscott327/react-native-picker-select---example