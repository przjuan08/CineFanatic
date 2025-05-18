"use client"

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"

// Importar pantallas
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import HomeScreen from "../screens/HomeScreen"
import DetailsScreen from "../screens/DetailsScreen"
import ProfileScreen from "../screens/ProfileScreen"

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
  const { userToken, isLoading } = useAuth()
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
        </>
      )}
    </Stack.Navigator>
  )
}
