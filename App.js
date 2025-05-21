"use client"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { StatusBar } from "react-native"

// Importar el navegador de autenticación
import AuthNavigator from "./components/navigation/AuthNavigator"

// Importar contextos
import { AuthProvider } from "./components/context/AuthContext"
import { ThemeProvider, useTheme } from "./components/context/ThemeContext"

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
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </ThemeProvider>
  )
}
