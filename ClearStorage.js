import AsyncStorage from "@react-native-async-storage/async-storage"

// Función para limpiar completamente AsyncStorage
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear()
    console.log("✅ AsyncStorage limpiado completamente")
    return true
  } catch (e) {
    console.error("❌ Error al limpiar AsyncStorage:", e)
    return false
  }
}

// Función para verificar el contenido de AsyncStorage (para depuración)
export const checkStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    console.log("🔑 Keys en AsyncStorage:", keys)

    const result = {}
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key)
      try {
        result[key] = JSON.parse(value)
      } catch (e) {
        result[key] = value
      }
    }
    console.log("📦 Contenido de AsyncStorage:", result)
    return result
  } catch (e) {
    console.error("❌ Error al verificar AsyncStorage:", e)
    return null
  }
}

// Función para limpiar solo los datos de autenticación
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem("userToken")
    await AsyncStorage.removeItem("userData")
    console.log("🔑 Datos de autenticación eliminados")
    return true
  } catch (e) {
    console.error("❌ Error al limpiar datos de autenticación:", e)
    return false
  }
}
