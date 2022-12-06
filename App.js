import { registerRootComponent } from 'expo';
import { ThemeProvider, Button, createTheme, Text, Image, Avatar, Switch, lightColors, useThemeMode } from '@rneui/themed';
import { Platform, SafeAreaView, View } from 'react-native';
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold,
  OpenSans_800ExtraBold_Italic
} from '@expo-google-fonts/open-sans'
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './Screens/HomeScreen';
import AllLights from './context/lightsContext';
import { StatusBar } from 'expo-status-bar';



const theme = createTheme({


  lightColors: {
    background: '#f3f3f3',
    white: '#f5f5f5',
    black: '#1e1e1e'
  },
  darkColors: {
    white: '#f5f5f5',
    background: '#1e1e1e',
  },

});

// Your App
export default function App() {
  let [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_300Light_Italic,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold,
    OpenSans_800ExtraBold_Italic,
  })


  if (!fontsLoaded) {
    return (
      <ThemeProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button loading type='clear' />
        </View>
      </ThemeProvider>
    )
  } else {

    return (
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <StatusBar style='auto' />
          <AllLights>
            <HomeScreen />
          </AllLights>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
};
registerRootComponent(App);