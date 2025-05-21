"use client"

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

// Importar pantallas de autenticación
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"

// Importar el navegador de pestañas
import TabNavigator from "./TabNavigator"

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
  const { userToken, isLoading } = useAuth()
  const { theme } = useTheme()
  const [isAppReady, setIsAppReady] = React.useState(false)

  // Efecto para verificar el estado inicial de la app
  React.useEffect(() => {
    const prepareApp = async () => {
      try {
        // Simular un pequeño retraso para mostrar el splash
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        setIsAppReady(true)
      }
    }

    prepareApp()
  }, [])

  // Mostrar SplashScreen mientras se carga la app
  if (!isAppReady || isLoading) {
    return <SplashScreen />
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
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
        // Usar el navegador de pestañas para las rutas autenticadas
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  )
}
