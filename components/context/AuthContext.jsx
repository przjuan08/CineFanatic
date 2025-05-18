"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Crear el contexto
export const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")

  // Verificar si hay un usuario autenticado al iniciar
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log("Verificando autenticación...")

        // Verificar si hay un token guardado
        const token = await AsyncStorage.getItem("userToken")
        console.log("Token encontrado:", token)

        if (token) {
          // Si hay token, cargar los datos del usuario
          const userDataString = await AsyncStorage.getItem("userData")
          if (userDataString) {
            const parsedUserData = JSON.parse(userDataString)
            console.log("Datos de usuario encontrados:", parsedUserData.name)
            setUserData(parsedUserData)
            setUserToken(token)
          } else {
            // Si no hay datos de usuario pero hay token, limpiar el token
            console.log("Token sin datos de usuario, limpiando...")
            await AsyncStorage.removeItem("userToken")
            setUserToken(null)
          }
        } else {
          console.log("No hay token, usuario no autenticado")
          // Asegurarse de que el estado refleje que no hay usuario autenticado
          setUserToken(null)
          setUserData(null)
        }
      } catch (e) {
        console.error("Error al restaurar token:", e)
        // En caso de error, asegurarse de que el usuario no esté autenticado
        setUserToken(null)
        setUserData(null)
      } finally {
        setIsLoading(false)
      }
    }

    bootstrapAsync()
  }, [])

  // Función para registrar un nuevo usuario
  const register = async (name, email, password) => {
    setIsLoading(true)
    setError("")

    try {
      // Verificar si el email ya está registrado
      const usersString = await AsyncStorage.getItem("users")
      const users = usersString ? JSON.parse(usersString) : []

      const existingUser = users.find((user) => user.email === email)
      if (existingUser) {
        setError("Este correo electrónico ya está registrado")
        setIsLoading(false)
        return false
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // En una app real, esto debería estar encriptado
        favorites: [],
        createdAt: new Date().toISOString(),
      }

      // Guardar en la "base de datos" local
      users.push(newUser)
      await AsyncStorage.setItem("users", JSON.stringify(users))

      // Ya no iniciamos sesión automáticamente
      setIsLoading(false)
      return true
    } catch (e) {
      console.error("Error al registrar:", e)
      setError("Error al registrar. Inténtalo de nuevo.")
      setIsLoading(false)
      return false
    }
  }

  // Función para iniciar sesión
  const login = async (email, password) => {
    setIsLoading(true)
    setError("")

    try {
      console.log("Intentando iniciar sesión con:", email)

      // Buscar usuario en la "base de datos" local
      const usersString = await AsyncStorage.getItem("users")
      const users = usersString ? JSON.parse(usersString) : []
      console.log("Usuarios encontrados:", users.length)

      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        console.log("Usuario no encontrado o contraseña incorrecta")
        setError("Correo electrónico o contraseña incorrectos")
        setIsLoading(false)
        return false
      }

      console.log("Usuario encontrado:", user.name)

      // Guardar token
      const token = user.id
      await AsyncStorage.setItem("userToken", token)

      // Guardar datos del usuario (sin la contraseña)
      const userToStore = { ...user }
      delete userToStore.password
      await AsyncStorage.setItem("userData", JSON.stringify(userToStore))

      // Actualizar estado
      setUserToken(token)
      setUserData(userToStore)

      console.log("Sesión iniciada correctamente")
      setIsLoading(false)
      return true
    } catch (e) {
      console.error("Error al iniciar sesión:", e)
      setError("Error al iniciar sesión. Inténtalo de nuevo.")
      setIsLoading(false)
      return false
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("Cerrando sesión...")

      // Eliminar datos de autenticación
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userData")

      // Actualizar estado
      setUserToken(null)
      setUserData(null)

      console.log("Sesión cerrada correctamente")
    } catch (e) {
      console.error("Error al cerrar sesión:", e)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para añadir/quitar película de favoritos
  const toggleFavorite = async (movieId) => {
    if (!userData) return false

    try {
      // Clonar el array de favoritos
      const favorites = [...(userData.favorites || [])]

      // Verificar si la película ya está en favoritos
      const index = favorites.indexOf(movieId)

      if (index >= 0) {
        // Si existe, quitarla
        favorites.splice(index, 1)
      } else {
        // Si no existe, añadirla
        favorites.push(movieId)
      }

      // Actualizar userData
      const updatedUserData = {
        ...userData,
        favorites,
      }

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData))

      // Actualizar también en la "base de datos" de usuarios
      const usersString = await AsyncStorage.getItem("users")
      if (usersString) {
        const users = JSON.parse(usersString)
        const userIndex = users.findIndex((u) => u.id === userData.id)

        if (userIndex >= 0) {
          users[userIndex] = {
            ...users[userIndex],
            favorites,
          }
          await AsyncStorage.setItem("users", JSON.stringify(users))
        }
      }

      // Actualizar estado
      setUserData(updatedUserData)

      return true
    } catch (e) {
      console.error("Error al actualizar favoritos:", e)
      return false
    }
  }

  // Verificar si una película está en favoritos
  const isFavorite = (movieId) => {
    return userData?.favorites?.includes(movieId) || false
  }

  // Valores que se proveerán a través del contexto
  const value = {
    isLoading,
    userToken,
    userData,
    error,
    login,
    register,
    logout,
    toggleFavorite,
    isFavorite,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
