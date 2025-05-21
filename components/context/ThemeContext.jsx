"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Definir los colores para cada tema
export const lightTheme = {
  // Colores principales
  primary: "#032541",
  secondary: "#01b4e4",
  background: "#f5f5f5",
  card: "#ffffff",
  text: "#333333",
  textSecondary: "#666666",
  border: "#e0e0e0",

  // Colores específicos
  error: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFD700",
  info: "#2196F3",

  // Elementos de UI
  headerBackground: "#032541",
  headerText: "#ffffff",
  tabBarBackground: "#ffffff",
  tabBarActive: "#032541",
  tabBarInactive: "#999999",

  // Botones
  buttonPrimary: "#032541",
  buttonPrimaryText: "#ffffff",
  buttonSecondary: "#01b4e4",
  buttonSecondaryText: "#ffffff",
  buttonDanger: "#FF6B6B",
  buttonDangerText: "#ffffff",

  // Inputs
  inputBackground: "#ffffff",
  inputText: "#333333",
  inputPlaceholder: "#999999",
  inputBorder: "#ddd",

  // Switches
  switchTrackActive: "#81b0ff",
  switchThumbActive: "#032541",
  switchTrackInactive: "#767577",
  switchThumbInactive: "#f4f3f4",
}

export const darkTheme = {
  // Colores principales
  primary: "#01b4e4",
  secondary: "#032541",
  background: "#121212",
  card: "#1e1e1e",
  text: "#f0f0f0",
  textSecondary: "#a0a0a0",
  border: "#2c2c2c",

  // Colores específicos
  error: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFD700",
  info: "#2196F3",

  // Elementos de UI
  headerBackground: "#1a1a1a",
  headerText: "#ffffff",
  tabBarBackground: "#1a1a1a",
  tabBarActive: "#01b4e4",
  tabBarInactive: "#777777",

  // Botones
  buttonPrimary: "#01b4e4",
  buttonPrimaryText: "#ffffff",
  buttonSecondary: "#032541",
  buttonSecondaryText: "#ffffff",
  buttonDanger: "#FF6B6B",
  buttonDangerText: "#ffffff",

  // Inputs
  inputBackground: "#2c2c2c",
  inputText: "#f0f0f0",
  inputPlaceholder: "#777777",
  inputBorder: "#444444",

  // Switches
  switchTrackActive: "#01b4e4",
  switchThumbActive: "#ffffff",
  switchTrackInactive: "#444444",
  switchThumbInactive: "#f4f3f4",
}

// Crear el contexto
const ThemeContext = createContext()

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  // Obtener el esquema de colores del sistema
  const systemColorScheme = useColorScheme()

  // Estado para el modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false)
  // Estado para seguir el sistema
  const [followSystem, setFollowSystem] = useState(true)
  // Estado para el tema actual
  const [theme, setTheme] = useState(lightTheme)

  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("isDarkMode")
        const savedFollowSystem = await AsyncStorage.getItem("followSystem")

        // Si hay preferencias guardadas, usarlas
        if (savedFollowSystem !== null) {
          const parsedFollowSystem = savedFollowSystem === "true"
          setFollowSystem(parsedFollowSystem)

          if (parsedFollowSystem) {
            // Si sigue al sistema, usar el esquema del sistema
            const shouldUseDarkMode = systemColorScheme === "dark"
            setIsDarkMode(shouldUseDarkMode)
            setTheme(shouldUseDarkMode ? darkTheme : lightTheme)
          } else if (savedDarkMode !== null) {
            // Si no sigue al sistema, usar la preferencia guardada
            const parsedDarkMode = savedDarkMode === "true"
            setIsDarkMode(parsedDarkMode)
            setTheme(parsedDarkMode ? darkTheme : lightTheme)
          }
        } else if (savedDarkMode !== null) {
          // Compatibilidad con versiones anteriores
          const parsedDarkMode = savedDarkMode === "true"
          setIsDarkMode(parsedDarkMode)
          setTheme(parsedDarkMode ? darkTheme : lightTheme)
        }
      } catch (error) {
        console.error("Error al cargar preferencias de tema:", error)
      }
    }

    loadThemePreferences()
  }, [systemColorScheme])

  // Actualizar el tema cuando cambia el modo oscuro
  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme)
  }, [isDarkMode])

  // Función para cambiar el modo oscuro
  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !isDarkMode
      setIsDarkMode(newDarkMode)

      // Si no sigue al sistema, guardar la preferencia
      if (!followSystem) {
        await AsyncStorage.setItem("isDarkMode", newDarkMode.toString())
      }
    } catch (error) {
      console.error("Error al guardar preferencia de tema:", error)
    }
  }

  // Función para cambiar si sigue al sistema
  const toggleFollowSystem = async (value) => {
    try {
      setFollowSystem(value)
      await AsyncStorage.setItem("followSystem", value.toString())

      if (value) {
        // Si ahora sigue al sistema, usar el esquema del sistema
        const shouldUseDarkMode = systemColorScheme === "dark"
        setIsDarkMode(shouldUseDarkMode)
        await AsyncStorage.setItem("isDarkMode", shouldUseDarkMode.toString())
      }
    } catch (error) {
      console.error("Error al guardar preferencia de seguir sistema:", error)
    }
  }

  // Valores que se proveerán a través del contexto
  const value = {
    isDarkMode,
    theme,
    toggleDarkMode,
    followSystem,
    toggleFollowSystem,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
