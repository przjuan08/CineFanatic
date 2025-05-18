"use client"

import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { View, ActivityIndicator } from "react-native"

// Importar pantallas - con importaciones explícitas
import SplashScreen from "./components/screens/SplashScreen"
import LoginScreen from "./components/screens/LoginScreen"
import RegisterScreen from "./components/screens/RegisterScreen"
import HomeScreen from "./components/screens/HomeScreen"
import DetailsScreen from "./components/screens/DetailsScreen"
import ProfileScreen from "./components/screens/ProfileScreen"
import DebugScreen from "./components/screens/DebugScreen"

// Importar contexto de autenticación
import { AuthProvider, AuthContext } from "./components/context/AuthContext"

const Stack = createNativeStackNavigator()

// Componente que maneja la navegación basada en el estado de autenticación
function Navigation() {
  const { userToken, isLoading } = React.useContext(AuthContext)

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#032541" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#032541",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {userToken === null ? (
        // Rutas de autenticación
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        // Rutas de la aplicación
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "CineFanatic" }} />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => ({ title: route.params?.title || "Movie Details" })}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Mi perfil" }} />
          <Stack.Screen name="Debug" component={DebugScreen} options={{ title: "Depuración" }} />
        </>
      )}
    </Stack.Navigator>
  )
}

// Componente principal de la aplicación
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    // Simular un tiempo de carga para mostrar el splash screen
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  if (!appIsReady) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  )
}
