"use client"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { StatusBar, Platform, LogBox } from "react-native"
import { useEffect, useRef, useState } from "react"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"

// Suprimir el error específico de notificaciones
LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53",
])

// Importar el navegador de autenticación
import AuthNavigator from "./components/navigation/AuthNavigator"

// Importar contextos
import { AuthProvider } from "./components/context/AuthContext"
import { ThemeProvider, useTheme } from "./components/context/ThemeContext"

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Componente principal que configura la navegación
function Navigation() {
  const { theme, isDarkMode } = useTheme()

  // Personalizar los temas de navegación
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.headerBackground} />
      <NavigationContainer theme={isDarkMode ? customDarkTheme : customLightTheme}>
        <AuthNavigator />
      </NavigationContainer>
    </>
  )
}

// Componente principal de la aplicación
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    // Función para registrar notificaciones con manejo de errores
    const setupNotifications = async () => {
      try {
        // Registrar para obtener token de notificaciones push
        const token = await registerForPushNotificationsAsync()
        if (token) setExpoPushToken(token)

        // Listener para recibir notificaciones mientras la app está en primer plano
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification)
        })

        // Listener para responder a la interacción del usuario con la notificación
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notificación respondida:", response)
        })
      } catch (error) {
        // Silenciar errores específicos relacionados con notificaciones en Expo Go
        if (!error.message?.includes("SDK 53")) {
          console.error("Error al configurar notificaciones:", error)
        }
      }
    }

    setupNotifications()

    return () => {
      // Limpiar listeners cuando el componente se desmonta
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </ThemeProvider>
  )
}

// Función para registrar el dispositivo para notificaciones push
async function registerForPushNotificationsAsync() {
  let token

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        console.log("¡No se pudieron obtener permisos para las notificaciones push!")
        return null
      }

      // Obtener el token de Expo
      try {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          })
        ).data

        console.log("Token de notificaciones push:", token)
      } catch (error) {
        // Si estamos en Expo Go en Android con SDK 53+, este error es esperado
        // Silenciamos el error pero registramos que no pudimos obtener un token
        console.log("No se pudo obtener token para notificaciones remotas en Expo Go")
      }
    } else {
      console.log("Debes usar un dispositivo físico para recibir notificaciones push")
    }
  } catch (error) {
    // Silenciar errores específicos
    if (!error.message?.includes("SDK 53")) {
      console.error("Error en registerForPushNotificationsAsync:", error)
    }
  }

  return token
}
