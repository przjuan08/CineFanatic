"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as FileSystem from "expo-file-system"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext" // Importar el contexto de tema

// Directorio donde se guardarán los recuerdos
const MEMORIES_DIRECTORY = `${FileSystem.documentDirectory}memories/`

// Componente principal para mostrar todos los recuerdos guardados
export default function MemoriesScreen() {
  const navigation = useNavigation()
  const { theme, isDarkMode } = useTheme() // Obtener el tema actual
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar los recuerdos al iniciar la pantalla
  useEffect(() => {
    loadMemories()

    // Actualizar la lista cuando regresamos a esta pantalla
    const unsubscribe = navigation.addListener("focus", () => {
      loadMemories()
    })

    return unsubscribe
  }, [navigation])

  // Función para cargar los recuerdos guardados
  const loadMemories = async () => {
    try {
      console.log("Cargando recuerdos...")
      // Asegurarse de que el directorio existe
      const dirInfo = await FileSystem.getInfoAsync(MEMORIES_DIRECTORY)
      if (!dirInfo.exists) {
        console.log("El directorio no existe, creándolo...")
        await FileSystem.makeDirectoryAsync(MEMORIES_DIRECTORY, { intermediates: true })
        setMemories([])
        setLoading(false)
        return
      }

      // Leer el archivo de metadatos que contiene la información de todos los recuerdos
      const metadataFile = `${MEMORIES_DIRECTORY}metadata.json`
      const metadataInfo = await FileSystem.getInfoAsync(metadataFile)

      if (metadataInfo.exists) {
        console.log("Archivo de metadatos encontrado, leyendo...")
        const metadataContent = await FileSystem.readAsStringAsync(metadataFile)
        const parsedMemories = JSON.parse(metadataContent)
        console.log(`Se encontraron ${parsedMemories.length} recuerdos`)
        setMemories(parsedMemories.sort((a, b) => b.timestamp - a.timestamp)) // Ordenar por fecha (más reciente primero)
      } else {
        console.log("No se encontró archivo de metadatos")
        setMemories([])
      }
    } catch (error) {
      console.error("Error al cargar recuerdos:", error)
      Alert.alert("Error", "No se pudieron cargar los recuerdos")
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar un recuerdo
  const deleteMemory = async (id) => {
    try {
      // Confirmar eliminación
      Alert.alert("Eliminar recuerdo", "¿Estás seguro de que quieres eliminar este recuerdo?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            // Actualizar el archivo de metadatos
            const metadataFile = `${MEMORIES_DIRECTORY}metadata.json`
            const updatedMemories = memories.filter((memory) => memory.id !== id)
            await FileSystem.writeAsStringAsync(metadataFile, JSON.stringify(updatedMemories))

            // Eliminar el archivo de imagen
            const memoryToDelete = memories.find((memory) => memory.id === id)
            if (memoryToDelete) {
              await FileSystem.deleteAsync(memoryToDelete.uri, { idempotent: true })
            }

            // Actualizar el estado
            setMemories(updatedMemories)
          },
          style: "destructive",
        },
      ])
    } catch (error) {
      console.error("Error al eliminar recuerdo:", error)
      Alert.alert("Error", "No se pudo eliminar el recuerdo")
    }
  }

  // Renderizar cada recuerdo en la lista
  const renderMemoryItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.memoryCard, { backgroundColor: theme.card }]} 
        onPress={() => navigation.navigate("MemoryDetail", { memory: item })}
      >
        <Image source={{ uri: item.uri }} style={styles.memoryImage} />
        <View style={styles.memoryInfo}>
          <Text style={[styles.memoryDate, { color: theme.textSecondary }]}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          <Text style={[styles.memoryDescription, { color: theme.text }]} numberOfLines={2}>
            {item.description || "Sin descripción"}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMemory(item.id)}>
          <Ionicons name="trash-outline" size={22} color={theme.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  // Renderizar mensaje cuando no hay recuerdos
  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={80} color={theme.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.text }]}>No hay recuerdos guardados</Text>
        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
          Tus recuerdos capturados aparecerán aquí
        </Text>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: theme.primary }]} 
          onPress={() => navigation.navigate("CameraMemory")}
        >
          <Text style={styles.createButtonText}>Crear nuevo recuerdo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Mostrar indicador de carga mientras se cargan los recuerdos
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.headerBackground,
        borderBottomColor: theme.border 
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("HomeScreen")}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          <Text style={[styles.backButtonText, { color: theme.headerText }]}>Inicio</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>Mis Recuerdos</Text>
      </View>
      <FlatList
        data={memories}
        renderItem={renderMemoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Botón flotante para crear un nuevo recuerdo */}
      {memories.length > 0 && (
        <TouchableOpacity 
          style={[styles.floatingButton, { backgroundColor: theme.primary }]} 
          onPress={() => navigation.navigate("CameraMemory")}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio para el botón flotante
  },
  memoryCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flexDirection: "row",
  },
  memoryImage: {
    width: 100,
    height: 100,
  },
  memoryInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  memoryDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  memoryDescription: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 32, // Para compensar el botón de atrás y centrar el título
  },
})