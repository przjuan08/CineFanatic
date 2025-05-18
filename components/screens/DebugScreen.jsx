"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../context/AuthContext"

export default function DebugScreen() {
  const { userToken, userData, logout } = useAuth()
  const [storageData, setStorageData] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadStorageData()
  }, [refreshKey])

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const result = {}

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key)
        try {
          // Intentar parsear como JSON
          result[key] = JSON.parse(value)
        } catch (e) {
          // Si no es JSON, guardar como string
          result[key] = value
        }
      }

      setStorageData(result)
    } catch (e) {
      console.error("Error al cargar datos:", e)
      Alert.alert("Error", "No se pudieron cargar los datos de AsyncStorage")
    }
  }

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear()
      Alert.alert("Éxito", "Se han eliminado todos los datos de AsyncStorage")
      setRefreshKey((prev) => prev + 1)
    } catch (e) {
      Alert.alert("Error", "No se pudieron eliminar los datos")
    }
  }

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userData")
      Alert.alert("Éxito", "Se han eliminado los datos de autenticación")
      setRefreshKey((prev) => prev + 1)

      // Cerrar sesión para actualizar el estado de la app
      await logout()
    } catch (e) {
      Alert.alert("Error", "No se pudieron eliminar los datos de autenticación")
    }
  }

  const renderJsonValue = (value, depth = 0) => {
    if (value === null || value === undefined) {
      return <Text style={styles.nullValue}>null</Text>
    }

    if (typeof value === "object") {
      return (
        <View style={{ marginLeft: depth * 10 }}>
          {Object.entries(value).map(([key, val]) => (
            <View key={key} style={styles.jsonItem}>
              <Text style={styles.jsonKey}>{key}: </Text>
              {renderJsonValue(val, depth + 1)}
            </View>
          ))}
        </View>
      )
    }

    return <Text style={styles.jsonValue}>{String(value)}</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado de Autenticación</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Token: </Text>
          <Text style={styles.value}>{userToken || "No autenticado"}</Text>
        </View>

        <Text style={styles.subTitle}>Datos de Usuario:</Text>
        {userData ? (
          <View style={styles.userDataContainer}>{renderJsonValue(userData)}</View>
        ) : (
          <Text style={styles.noData}>No hay datos de usuario</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contenido de AsyncStorage</Text>
        {Object.keys(storageData).length > 0 ? (
          Object.entries(storageData).map(([key, value]) => (
            <View key={key} style={styles.storageItem}>
              <Text style={styles.storageKey}>{key}</Text>
              <View style={styles.storageValue}>{renderJsonValue(value)}</View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No hay datos en AsyncStorage</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setRefreshKey((prev) => prev + 1)}>
          <Text style={styles.buttonText}>Actualizar datos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={clearAuthData}>
          <Text style={styles.buttonText}>Limpiar datos de autenticación</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllStorage}>
          <Text style={styles.buttonText}>Limpiar todo AsyncStorage</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#032541",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 80,
  },
  value: {
    flex: 1,
  },
  userDataContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
  },
  noData: {
    fontStyle: "italic",
    color: "#999",
    marginTop: 8,
  },
  storageItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
  },
  storageKey: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#032541",
  },
  storageValue: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
  },
  jsonItem: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  jsonKey: {
    fontWeight: "bold",
  },
  jsonValue: {
    flex: 1,
  },
  nullValue: {
    fontStyle: "italic",
    color: "#999",
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#032541",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})
